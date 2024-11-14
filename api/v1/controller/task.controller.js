const Task = require("../model/task.model");
const PaginationHelper = require("../../../Helper/pagination");
const searchHelper = require("../../../Helper/search");
//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status
    }
    //search
    let objectSearch = searchHelper(req.query);
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    //end-search
    //Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 2
    }
    const countTasks = Task.countDocuments(find);
    const objectPagination = PaginationHelper(
        initPagination,
        req.query,
        countTasks
    )
    //EndPagination
    //Sort
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    }
    //EndSort
    const task = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.json(task);
}
//[Get] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id
        })
        res.json(task)
    } catch (error) {
        res.json("Fail")
    }
}
//[Patch]/api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        await Task.updateOne({
            _id: id
        }, {
            status: status
        })
        res.json({
            code: 200,
            message: "Cập Nhật Trạng Thái Thành Công"
        })
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không Tồn Tại"
        })
    }
}
//[Patch]/api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;
        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Cập Nhật Trạng Thái Thành Công"
                });
                break;

            default:
                res.json({
                    code: 400,
                    message: "Không Tồn Tại"
                })
        }

    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không Tồn Tại"
        })
    }
}
