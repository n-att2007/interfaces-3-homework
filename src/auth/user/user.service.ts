import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { RoleService } from '../role/role.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private roleService: RoleService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const role = await this.roleService.findByName(createUserDto.roleName);
        if (!role) {
            throw new Error('Role not found');
        }

        const newUser = this.userRepository.create({
            ...createUserDto,
            role,
        });
        return await this.userRepository.save(newUser);
    }

    findAll(username?: string) {
        return this.userRepository.find({
            where: username ? { username: username } : {},
            order: { createdAt: 'DESC' },
        });
    }

    findById(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    findOneRelations(id: number) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['role'],
        });
    }

    async findOneWithPermissions(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['role', 'role.permissions'],
        });
    }

    async findAllWithPermissions() {
        return await this.userRepository.find({
            relations: ['role', 'role.permissions'],
            order: { createdAt: 'DESC' },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.userRepository.update(id, updateUserDto);
        return this.findById(id);
    }

    async remove(id: number) {
        const result = await this.userRepository.delete(id);
        if (result.affected) {
            return { id };
        }
        return null;
    }

    /**
     * Find all users with pagination and sorting
     */
    async findAllPage(page = 1, limit = 10, sortBy = 'createdAt', order: 'ASC' | 'DESC' = 'DESC') {
        const [users, total] = await this.userRepository.findAndCount({
            relations: ['role'],
            skip: (page - 1) * limit,
            take: limit,
            order: { [sortBy]: order },
        });

        return {
            data: users,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    /**
     * Find users by role name
     */
    async findByRole(roleName: string) {
        return await this.userRepository.find({
            where: { role: { name: roleName } },
            relations: ['role'],
            order: { username: 'ASC' },
        });
    }

    /**
     * Count total users
     */
    async count(): Promise<number> {
        return await this.userRepository.count();
    }

    /**
     * Count users by role
     */
    async countByRole(roleName: string): Promise<number> {
        return await this.userRepository.count({
            where: { role: { name: roleName } },
        });
    }
}
