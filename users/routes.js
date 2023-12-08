import * as dao from "./dao.js";

function UserRoutes(app) {
    const createUser = async (req, res) => {
        try {
            const user = await dao.createUser(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteUser = async (req, res) => {
        try {
            const status = await dao.deleteUser(req.params.userId);
            res.json(status);
        } catch (err) {
            console.log(err);
        }
    };

    const findAllUsers = async (req, res) => {
        try {
            const users = await dao.findAllUsers();
            res.json(users);
        } catch (err) {
            console.log(err);
        }
    };

    const findUserById = async (req, res) => {
        try {
            const user = await dao.findUserById(req.params.userId);
            res.json(user);
        } catch (err) {
            console.log(err);
        }
    };

    const updateUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const status = await dao.updateUser(userId, req.body);
            const currentUser = await dao.findUserById(userId);
            req.session['currentUser'] = currentUser;
            res.json(status);
        } catch (err) {
            console.log(err);
        }
    };

    const signup = async (req, res) => {
        try {
            const user = await dao.findUserByUsername(
                req.body.username);
            if (user) {
                res.status(400).json(
                    { message: "Username already taken" });
            }
            const currentUser = await dao.createUser(req.body);
            req.session['currentUser'] = currentUser;
            res.json(currentUser);
        } catch (err) {
            console.log(err);
        }
    };

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const currentUser = await dao.findUserByCredentials(username, password);
            req.session['currentUser'] = currentUser;
            res.json(currentUser);
        } catch (err) {
            console.log(err);
        }
    };

    const signout = (req, res) => {
        try {
            // currentUser = null;
            req.session.destroy();
            res.json(200);
        } catch (err) {
            console.log(err);
        }
    };

    const account = async (req, res) => {
        try {
            res.json(req.session['currentUser']);
            // res.json(currentUser);
        } catch (err) {
            console.log(err);
        }
    };

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/account", account);
}


export default UserRoutes;