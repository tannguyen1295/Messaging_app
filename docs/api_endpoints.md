# API endpoints

These are available endpoints that can be used in this project.

## Users

| Method | URL               | Description                       |
| ------ | ----------------- | --------------------------------- |
| `GET`  | `/users`          | Retrieve all users.               |
| `POST` | `/users/register` | Register a new user.              |
| `POST` | `/users/signin`   | Log in user to get the jwt token. |

## Messages

| Method | URL                     | Description                                                                                  |
| ------ | ----------------------- | -------------------------------------------------------------------------------------------- |
| `GET`  | `/messages/{user_name}` | Get all messages that have been sent to the user, ordered by date with newest message first. |
| `POST` | `/messages/{user_name}` | Send a message to the user.                                                                  |
