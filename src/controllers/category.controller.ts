import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        const err = error as any;
        if (err.code === 'P2002') {
            res.status(400).json({ error: 'Category name already exists' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const category = await categoryService.updateCategory(id, req.body);
        res.status(200).json(category);
    } catch (error) {
        const err = error as any;
        if (err.code === 'P2002') {
            res.status(400).json({ error: 'Category name already exists' });
        } else if (err.code === 'P2025') {
            res.status(404).json({ error: 'Category not found' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        await categoryService.deleteCategory(id);
        res.status(204).send();
    } catch (error) {
        const err = error as any;
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Category not found' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};
