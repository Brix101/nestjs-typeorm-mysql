import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}


  async create(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOneOrFail(createUserDto);

      return ({message:"User Already Registered"});
    } catch (error) {
      return await this.userRepository.save(createUserDto);
    }
  }

  findAll() {
    return this.userRepository.find({
      relations: ['pets']
    });
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneOrFail(id);
      return user;
    } catch (error) {
      throw new NotFoundException("User Not Found");
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.findOneOrFail(id);

      await this.userRepository.update(id, updateUserDto);
      return await this.userRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException("User Not Found");
    }
  }

  async updateStatus(id: string){
    try{
      const user = await this.userRepository.findOneOrFail(id); 
    
      user.isActive = !user.isActive;
  
      return this.userRepository.save(user);
    }catch(error){
      throw new NotFoundException("User Not Found");
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOneOrFail(id);
      await this.userRepository.remove(user)
      return {message:`User ${id} is Removed`};
    } catch (error) {
      throw new NotFoundException("User Not Found");
    }
  }
}
