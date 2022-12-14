import { Request, Response, NextFunction } from "express";
import { Model, HydratedDocument } from "mongoose";
import { catchAsync } from "./catch-async";
import { ErrorObject } from "./error";
import { QueryMethod } from "./query";

export const getOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findById(req.params.id);

    if (!doc)
      return next(
        new ErrorObject(`Document with the id ${req.params.id} not found`, 404)
      );

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

// @ts-ignore
export const getAll = (Model) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter = req.params.tourId ? { tourRef: req.params.tourId } : {};
    const features = new QueryMethod(Model.find(filter), req.query)
      .sort()
      .limit()
      .paginate()
      .filter();

    const docs = await features.query;
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

//   @ts-ignore
export const createOne = (Model) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

//   @ts-ignore
export const deleteOne = (Model) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id, {
      strict: true,
    });
    if (!doc)
      return next(
        new ErrorObject(`Document with the id ${req.params.id} not found`, 404)
      );
    res.status(204).json({
      status: "deleted",
      data: null,
    });
  });

export const updateOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.role) {
      return next(new ErrorObject("You can't update it here", 400));
    }
    const updatedData = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedData)
      return next(
        new ErrorObject(`Document with the id ${req.params.id} not found`, 404)
      );
    res.status(200).json({
      status: "success",
      data: updatedData,
    });
  });
