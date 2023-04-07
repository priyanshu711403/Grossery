
// import categoryModel from '../models/ategoryModel.js'
import slugify from 'slugify'
import categoryModel from "../models/categoryModel.js"

export const createCategoryController = async (req,res)=>{
    try {
        const {name}=req.body
        if(!name){
                return res.status(401).send({message: 'category name is required'})
        }
        const existingCategory= await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category already created'
            })
        }
        const category = await new categoryModel({name}).save()
        res.status(201).send({success:true,
            message: 'new category created',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'error in category'
        })
    }

}