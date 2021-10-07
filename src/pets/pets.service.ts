import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';

@Injectable()
export class PetsService {

  constructor(
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}

  async create(createPetDto: CreatePetDto) {
    try {
      const ownerId ="e77990ba-23b3-4ca4-b762-b9e5481923ee";
      const user = await this.userRepository.findOneOrFail(ownerId);

      const pet = await this.petRepository.save(createPetDto);
      pet.owner = user;
      return await this.petRepository.save(pet);
    } catch (error) {
      throw new NotFoundException("User Not Found");
    }
  }

  async findAll() {
    return await this.petRepository.find({
      relations:['owner']
    });
  }

  async findOne(id: string) {
    try {
      const user = await this.petRepository.findOneOrFail(id);
      return user;
    } catch (error) {
      throw new NotFoundException("User Not Found");
    }
  }

  async update(id: string, updatePetDto: UpdatePetDto) {
    try {
      const ownerId ="e77990ba-23b3-4ca4-b762-b9e5481923ee";
      const user = await this.userRepository.findOneOrFail(ownerId);

      const pet = await this.petRepository.findOneOrFail(id,{relations:['owner']});

      if(pet.owner.id == user.id){
        pet.name = updatePetDto.name;
        return this.petRepository.save(pet);
      }else{
        throw new UnauthorizedException("Your Not the Owner of this Pet");
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async remove(id: string) {
    try {
      const ownerId ="e77990ba-23b3-4ca4-b762-b9e5481923ee";
      const user = await this.userRepository.findOneOrFail(ownerId);

      const pet = await this.petRepository.findOneOrFail(id,{relations:['owner']});

      if(pet.owner.id == user.id){
        await this.petRepository.remove(pet)
        return {message:`Pet ${id} is Removed`};
      }else{
        throw new UnauthorizedException("Your Not the Owner of this Pet");
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
