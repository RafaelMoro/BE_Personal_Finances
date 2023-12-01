import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Category } from '../entities/categories.entity';
import { UpdateSubcategoriesResponse } from '../interface';
import {
  CreateCategoriesDto,
  DeleteCategoryDto,
  UpdateCategoriesDto,
} from '../dtos/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findbyUser(sub: string) {
    try {
      const categories = await this.categoryModel
        .find({ sub }, { sub: 0 })
        .exec();
      return {
        categories,
        error: false,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const category = await this.categoryModel.find({ _id: id }).exec();
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByName(categoryName: string) {
    try {
      const category = await this.categoryModel.find({ categoryName }).exec();
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createOne(payload: CreateCategoriesDto, userId: string) {
    try {
      const completeData = { ...payload, sub: userId };
      const newModel = new this.categoryModel(completeData);
      const model = await newModel.save();
      return model;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCategory(changes: UpdateCategoriesDto) {
    try {
      const { categoryId } = changes;
      const updateCategory = await this.categoryModel
        .findByIdAndUpdate(categoryId, { $set: changes }, { new: true })
        .exec();
      if (!updateCategory) throw new BadRequestException('Category not found');
      return updateCategory;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateSubcategories(
    category: Category & {
      _id: Types.ObjectId;
    },
    subCategory: string,
  ): Promise<UpdateSubcategoriesResponse> {
    try {
      // Verify that the sub category exists in the category fetched.
      const subCategoryExists = category?.subCategories.find(
        (item) => item === subCategory,
      );

      if (!subCategoryExists) {
        // If sub category does not exists, add it to the subCategories array of the category
        // And return the category id.
        const newSubCategories = [...category?.subCategories, subCategory];
        const modifyCategoryPayload: UpdateCategoriesDto = {
          categoryId: category._id,
          subCategories: newSubCategories,
        };
        const categoryUpdated = await this.updateCategory(
          modifyCategoryPayload,
        );
        return {
          message: 'Subcategory created',
          categoryId: categoryUpdated._id,
        };
      }

      return {
        message: 'Subcategory already exists',
        categoryId: category._id,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeCategory(payload: DeleteCategoryDto) {
    try {
      const { categoryId } = payload;
      const categoryDeleted = await this.categoryModel.findByIdAndDelete(
        categoryId,
      );
      if (!categoryDeleted) throw new BadRequestException('Category not found');
      return categoryDeleted;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}