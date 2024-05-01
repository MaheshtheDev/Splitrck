## Splitrck
> Analytics tool for your Splitwise

### Features
- Analyse your monthly expenses
- Know where you spending the most in a selected month
- Know how much you are lending the money to others
- PWA support

### Getting Started
To get started, you need to have a splitwise account.

1. Clone the repository
```sh
git clone https://github.com/maheshthedev/splitrck.git
```
2. Replace the Client Id, Client Secret and remaining secrets mentioned in `env.example`, you can get those values [here](https://secure.splitwise.com/apps), Don't forget to add callbackURL in Splitwise App which is gonna be `http://localhost:3000/api/auth/callback/splitwise`
4. Install the dependencies
```sh
npm install
```
4. Run the application
```sh
npm run dev
```

Now, you can access the application at `http://localhost:3000`

### Contributing
If you would like to contribute to the project, feel free to create a pull request.

### License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Support
If you have any questions or need help with the application, feel free to open an issue.
