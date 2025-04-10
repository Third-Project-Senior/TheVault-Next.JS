const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET||"amine_secret_key";
const {User}= require('../index.js');
module.exports = {

    authenticate : (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
    
        if (!token) return res.status(401).json({ message: 'Access denied' });
    
        try {
            req.user = jwt.verify(token, SECRET_KEY);
            next();
        } catch {
            res.status(403).json({ message: 'Invalid token' });
        }
    },

    isAdmin: (req, res, next) => {
        const user = req.user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' })
        }
        next();
    },
    
    getAllUsers: async (req, res) => {
        try {
        const users = await User.findAll();
        console.log('Fetched users:', users[0].id);
        
        res.status(200).json(users);
        } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
        }
    },
    getUserById: async (req, res) => {
        const { id } = req.params;  
        try {
            const user = await User.findByPk(id);       
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            
            if (!user) return res.status(404).json({ message: 'User not found' });
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
            
        } catch (error) {
            console.log(req.params);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
 
 
    Sign_up: async (req, res) => {
        const { name, email, password, role ,image} = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const userr = await User.findOne({ where: { email:email } })
            if(userr){
                res.status(400).json("email already exist")
            }
            const user = await User.create({ name, email, password: hashedPassword, role,image })

            res.status(201).json("user created");
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send(error);
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email:email } });
            if (!user) {
                return res.status(404).send({ message: 'User not found' })
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).send({ message: 'Invalid credentials' });
         }
    
            const token = jwt.sign({ id: user.id,role:user.role,status:user.status }, SECRET_KEY, { expiresIn: '24h' });
            
            res.status(200).send({ message: 'Login successful', token });

        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json(error);
        }
    },
    updateUser: async (req, res) => {
        const { id } = req.params;
        // const id = req.user.id;
        const { name, email, password, role, image ,status } = req.body;
        try {
            const user = await User.findByPk(id);
            
            if (!user) return res.status(404).json({ message: 'User not found' });

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword|| user.password;
            }
            await user.update({
                name: name || user.name,
                email: email || user.email,
                role: role || user.role,
                image: image || user.image,
                status: status || user.status,
            });

            res.status(200).json({ message: 'User updated successfully', user });
            console.log('User updated:', user.status);
            
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

}