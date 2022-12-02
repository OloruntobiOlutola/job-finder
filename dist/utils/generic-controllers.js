"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOne = exports.deleteOne = exports.createOne = exports.getAll = exports.getOne = void 0;
const catch_async_1 = require("./catch-async");
const error_1 = require("./error");
const query_1 = require("./query");
const getOne = (Model) => (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc)
        return next(new error_1.ErrorObject(`Document with the id ${req.params.id} not found`, 404));
    res.status(200).json({
        status: "success",
        data: doc,
    });
});
exports.getOne = getOne;
const getAll = (Model) => (0, catch_async_1.catchAsync)(async (req, res, next) => {
    let filter = req.params.tourId ? { tourRef: req.params.tourId } : {};
    const features = new query_1.QueryMethod(Model.find(filter), req.query)
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
exports.getAll = getAll;
const createOne = (Model) => (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: "success",
        data: doc,
    });
});
exports.createOne = createOne;
const deleteOne = (Model) => (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, {
        strict: true,
    });
    if (!doc)
        return next(new error_1.ErrorObject(`Document with the id ${req.params.id} not found`, 404));
    res.status(204).json({
        status: "deleted",
        data: null,
    });
});
exports.deleteOne = deleteOne;
const updateOne = (Model) => (0, catch_async_1.catchAsync)(async (req, res, next) => {
    if (req.body.password || req.body.role) {
        return next(new error_1.ErrorObject("You can't update it here", 400));
    }
    const updatedData = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedData)
        return next(new error_1.ErrorObject(`Document with the id ${req.params.id} not found`, 404));
    res.status(200).json({
        status: "success",
        data: updatedData,
    });
});
exports.updateOne = updateOne;
