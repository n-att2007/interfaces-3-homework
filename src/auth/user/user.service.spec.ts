import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { RoleService } from '../role/role.service';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
    let service: UserService;

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
        findAndCount: jest.fn(),
        count: jest.fn(),
    };

    const mockRoleService = {
        findByName: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useValue: mockRepository },
                { provide: RoleService, useValue: mockRoleService },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return all users without username filter', async () => {
        const mockUsers = [
            { id: 1, username: 'user1' },
            { id: 2, username: 'user2' },
        ];

        mockRepository.find.mockResolvedValue(mockUsers);

        const result = await service.findAll();
        expect(result).toEqual(mockUsers);
        expect(mockRepository.find).toHaveBeenCalledWith({ where: {}, order: { createdAt: 'DESC' } });
    });

    it('should return only one user when username filter is added', async () => {
        const mockUser = [{ id: 1, username: 'user1' }];

        mockRepository.find.mockResolvedValue(mockUser);

        const result = await service.findAll('user1');
        expect(result).toEqual(mockUser);
        expect(mockRepository.find).toHaveBeenCalledWith({
            where: { username: mockUser[0].username },
            order: { createdAt: 'DESC' },
        });
    });

    it('should return undefined when user is not found', async () => {
        mockRepository.findOne.mockResolvedValue(undefined);

        const result = await service.findById(1);

        expect(result).toEqual(undefined);
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should create a user when role exists', async () => {
        const dto = {
            username: 'new-user',
            email: 'new-user@test.com',
            passwordHash: '123456',
            bio: 'New user bio',
            roleName: 'ADMIN',
        };
        const role = { id: 10, name: 'ADMIN' };
        const entityToSave = { ...dto, role };
        const savedUser = { id: 1, ...entityToSave };

        mockRoleService.findByName.mockResolvedValue(role);
        mockRepository.create.mockReturnValue(entityToSave);
        mockRepository.save.mockResolvedValue(savedUser);

        const result = await service.create(dto as CreateUserDto);

        expect(result).toEqual(savedUser);
        expect(mockRoleService.findByName).toHaveBeenCalledWith('ADMIN');
        expect(mockRepository.create).toHaveBeenCalledWith({ ...dto, role });
        expect(mockRepository.save).toHaveBeenCalledWith(entityToSave);
    });

    it('should throw error when role does not exist on create', async () => {
        const dto = {
            username: 'new-user',
            email: 'new-user@test.com',
            passwordHash: '123456',
            bio: 'New user bio',
            roleName: 'UNKNOWN',
        };

        mockRoleService.findByName.mockResolvedValue(null);

        await expect(service.create(dto as CreateUserDto)).rejects.toThrow('Role not found');
        expect(mockRepository.create).not.toHaveBeenCalled();
        expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should return user with role relation', async () => {
        const userWithRole = { id: 1, username: 'user1', role: { id: 2, name: 'ADMIN' } };
        mockRepository.findOne.mockResolvedValue(userWithRole);

        const result = await service.findOneRelations(1);

        expect(result).toEqual(userWithRole);
        expect(mockRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ['role'],
        });
    });

    it('should return undefined when findOneRelations does not find a user', async () => {
        mockRepository.findOne.mockResolvedValue(undefined);

        const result = await service.findOneRelations(999);

        expect(result).toBeUndefined();
        expect(mockRepository.findOne).toHaveBeenCalledWith({
            where: { id: 999 },
            relations: ['role'],
        });
    });

    it('should return user with role and permissions relation', async () => {
        const user = {
            id: 1,
            username: 'user1',
            role: { id: 2, name: 'ADMIN', permissions: [{ id: 1, name: 'READ' }] },
        };
        mockRepository.findOne.mockResolvedValue(user);

        const result = await service.findOneWithPermissions(1);

        expect(result).toEqual(user);
        expect(mockRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ['role', 'role.permissions'],
        });
    });

    it('should return undefined when findOneWithPermissions does not find a user', async () => {
        mockRepository.findOne.mockResolvedValue(undefined);

        const result = await service.findOneWithPermissions(1000);

        expect(result).toBeUndefined();
        expect(mockRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1000 },
            relations: ['role', 'role.permissions'],
        });
    });

    it('should return all users with permissions', async () => {
        const users = [{ id: 1, username: 'user1' }];
        mockRepository.find.mockResolvedValue(users);

        const result = await service.findAllWithPermissions();

        expect(result).toEqual(users);
        expect(mockRepository.find).toHaveBeenCalledWith({
            relations: ['role', 'role.permissions'],
            order: { createdAt: 'DESC' },
        });
    });

    it('should return empty list when no users exist in findAllWithPermissions', async () => {
        mockRepository.find.mockResolvedValue([]);

        const result = await service.findAllWithPermissions();

        expect(result).toEqual([]);
        expect(mockRepository.find).toHaveBeenCalledWith({
            relations: ['role', 'role.permissions'],
            order: { createdAt: 'DESC' },
        });
    });

    it('should update a user and return updated user', async () => {
        const updateDto = { username: 'updated' };
        const updatedUser = { id: 1, username: 'updated' };

        mockRepository.update.mockResolvedValue({ affected: 1 });
        mockRepository.findOne.mockResolvedValue(updatedUser);

        const result = await service.update(1, updateDto as UpdateUserDto);

        expect(result).toEqual(updatedUser);
        expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should propagate error when update fails', async () => {
        const updateDto = { username: 'updated' };

        mockRepository.update.mockRejectedValue(new Error('DB error'));

        await expect(service.update(1, updateDto as UpdateUserDto)).rejects.toThrow('DB error');
        expect(mockRepository.findOne).not.toHaveBeenCalled();
    });

    it('should remove user and return deleted id', async () => {
        mockRepository.delete.mockResolvedValue({ affected: 1 });

        const result = await service.remove(3);

        expect(result).toEqual({ id: 3 });
        expect(mockRepository.delete).toHaveBeenCalledWith(3);
    });

    it('should return null when remove does not delete any user', async () => {
        mockRepository.delete.mockResolvedValue({ affected: 0 });

        const result = await service.remove(999);

        expect(result).toBeNull();
        expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });

    it('should return paginated users in findAllPage', async () => {
        const users = [{ id: 1, username: 'user1' }];
        mockRepository.findAndCount.mockResolvedValue([users, 25]);

        const result = await service.findAllPage(2, 10, 'createdAt', 'DESC');

        expect(result).toEqual({
            data: users,
            total: 25,
            page: 2,
            lastPage: 3,
        });
        expect(mockRepository.findAndCount).toHaveBeenCalledWith({
            relations: ['role'],
            skip: 10,
            take: 10,
            order: { createdAt: 'DESC' },
        });
    });

    it('should propagate error in findAllPage when repository fails', async () => {
        mockRepository.findAndCount.mockRejectedValue(new Error('Pagination error'));

        await expect(service.findAllPage()).rejects.toThrow('Pagination error');
    });

    it('should return users by role', async () => {
        const users = [{ id: 1, username: 'admin', role: { name: 'ADMIN' } }];
        mockRepository.find.mockResolvedValue(users);

        const result = await service.findByRole('ADMIN');

        expect(result).toEqual(users);
        expect(mockRepository.find).toHaveBeenCalledWith({
            where: { role: { name: 'ADMIN' } },
            relations: ['role'],
            order: { username: 'ASC' },
        });
    });

    it('should return empty list when no users match role', async () => {
        mockRepository.find.mockResolvedValue([]);

        const result = await service.findByRole('UNKNOWN');

        expect(result).toEqual([]);
        expect(mockRepository.find).toHaveBeenCalledWith({
            where: { role: { name: 'UNKNOWN' } },
            relations: ['role'],
            order: { username: 'ASC' },
        });
    });

    it('should return total users count', async () => {
        mockRepository.count.mockResolvedValue(12);

        const result = await service.count();

        expect(result).toBe(12);
        expect(mockRepository.count).toHaveBeenCalledWith();
    });

    it('should return zero in count when there are no users', async () => {
        mockRepository.count.mockResolvedValue(0);

        const result = await service.count();

        expect(result).toBe(0);
        expect(mockRepository.count).toHaveBeenCalledWith();
    });

    it('should return users count by role', async () => {
        mockRepository.count.mockResolvedValue(5);

        const result = await service.countByRole('ADMIN');

        expect(result).toBe(5);
        expect(mockRepository.count).toHaveBeenCalledWith({
            where: { role: { name: 'ADMIN' } },
        });
    });

    it('should return zero in countByRole when role has no users', async () => {
        mockRepository.count.mockResolvedValue(0);

        const result = await service.countByRole('GUEST');

        expect(result).toBe(0);
        expect(mockRepository.count).toHaveBeenCalledWith({
            where: { role: { name: 'GUEST' } },
        });
    });
});
