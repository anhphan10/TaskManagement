const Task = require("../model/task.model");
const PaginationHelper = require("../../../Helper/pagination");
const searchHelper = require("../../../Helper/search");
//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    let find = {
        $or:[
            {createdBy : req.user.id},
            {listUser : req.user.id}
        ],
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
            case "delete":
                await Task.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        deleted: true,
                        deletedAt: new Date()
                    }
                )
                res.json({
                    code: 200,
                    message: "Xóa Thành Công"
                })
                break;
            default:
                res.json({
                    code: 400,
                    message: "Lỗi!!"
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
//[post]/api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id
        const task = new Task(req.body);
        const data = await task.save();

        res.json({
            code: 200,
            message: "Tạo Thành Công",
            data: data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Fail",
        })
    }
}
//[Patch]/api/v1/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({ _id: id }, req.body)

        res.json({
            code: 200,
            message: "Cập Nhật Công Việc Thành Công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Fail"
        })
    }
}
//[DELETE]/api/v1/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        })
        res.json({
            code: 200,
            message: "Xóa Thành Công"

        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất Bại"

        })
    }
}
