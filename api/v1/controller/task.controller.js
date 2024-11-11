const Task = require("../model/task.model")
//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    let find = {
        deleted : false
    };
    if(req.query.status){
        find.status = req.query.status
    }
    const task = await Task.find(find);
    res.json(task);
}
//[Get] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id:id
        })
        res.json(task)
    } catch (error) {
        res.json("Fail")
    }
}