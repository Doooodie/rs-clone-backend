# rs-clone-api

Api for Rolling Scopes School task "RS-Clone".

## Setup and Running

- Use `node 18.x` or higher.
- Clone this repo: `$ git clone https://github.com/Doooodie/rs-clone-backend.git`.
- Go to downloaded folder: `$ cd rs-clone-backend`.
- Install dependencies: `$ npm install`.
- Start server: `$ npm start`.
- Now you can send requests to the address: `http://127.0.0.1:5000`.

## Usage

- **User**
  - [Create User](https://github.com/Doooodie/rs-clone-backend#create-user)
  - [Login User](https://github.com/Doooodie/rs-clone-backend#login-user)
- **File**
  - [Upload File](https://github.com/Doooodie/rs-clone-backend#upload-file)
  - [Get File](https://github.com/Doooodie/rs-clone-backend#get-file)
  - [Get Root](https://github.com/Doooodie/rs-clone-backend#get-root)
  - [Delete File](https://github.com/Doooodie/rs-clone-backend#delete-file)

## **Create User**

Creates a new user, returns JWT and json data about user.

<details>

- **URL**

  /user/registration

- **Method:**

  `POST`

- **Headers:**

  `'Content-Type': 'application/json'`

- **URL Params**

  None

- **Query Params**

  None

- **Data Params**

  ```typescript
    {
      name: string,
      email: string
      password: string
    }
  ```

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InVzZXIzIiwiZW1haWwiOiJ1c2VyM0BtYWlsLmNvbSIsImlhdCI6MTY3NzQzMTcxNiwiZXhwIjoxNjc3NDM1MzE2fQ.kQl2VPV_VgaZ7ox4mHRcQlU_Xw1AYspsOC4e9ZFnViE",
      "user": {
        "id": 3,
        "name": "user3",
        "email": "user3@mail.com"
      }
    }
    ```

- **Error Response:**

  - **Code:** 400 BAD REQUEST<br />
  - **Content:**

    Error: user with name «...» already exists; e-mail «...» is already in use

- **Notes:**

  None

</details>

## **Login User**

Return JWT and json data about user.

<details>

- **URL**

  /user/login

- **Method:**

  `POST`

- **Headers:**

  `'Content-Type': 'application/json'`

- **URL Params**

  None

- **Query Params**

  None

- **Data Params**

  ```typescript
    {
      name: string,
      email: string
      password: string
    }
  ```

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InVzZXIxIiwiZW1haWwiOiJ1c2VyMUBtYWlsLmNvbSIsImlhdCI6MTY3NzQzMjkxNCwiZXhwIjoxNjc3NDM2NTE0fQ.1_qNh1x5ceq8_pFlEa8pP43RK8XXxlkVHHvwKgscnGw",
      "user": {
        "id": 1,
        "name": "user1",
        "email": "user1@mail.com"
      }
    }
    ```

- **Error Response:**

  - **Code:** 500 Internal Server Error<br />
  - **Content:**

    Error: User named «...» with email «...» not found

- **Notes:**

  None

</details>

## **Upload File**

Upload file or folder to a user storage. Returns json data about uploaded file or folder

<details>

- **URL**

  /file/

- **Method:**

  `POST`

- **Headers:**

  `'Content-Type': 'Multipart/form-data'`
  `'Authorization': 'Bearer <JWT>'`

- **URL Params**

  None

- **Query Params**

  None

- **Data Params**
  body: form-data,

  ```typescript
  name: "slardar.jpg",
  size: 129,
  info: "fish",
  filePath: "folder3",
  type: "file",
  userId: 1,
  file: <attached_file>
  ```

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:**
    ```json
    {
      "id": 29,
      "name": "slardar.jpg",
      "size": 129,
      "info": "fish",
      "filePath": "C:\\JS\\rs-clone-backend\\public\\user1\\folder1\\folder3\\slardar.jpg",
      "parentPath": "C:\\JS\\rs-clone-backend\\public\\user1\\folder1\\folder3",
      "type": "file",
      "userId": 1,
      "updatedAt": "2023-02-26T16:01:23.723Z",
      "createdAt": "2023-02-26T16:01:23.723Z"
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED<br />
  - **Content:**

    User not authorized

  OR

  - **Code:** 500 INTERNAL SERVER ERROR<br />

  - **Content:**

    Error: there isn't an uploaded file; can't create a folder

- **Notes:**

  Upload file or folder to user storage. The "type" key indicates the type of file being sent: folder or file. In the case of "type"="folder", the "size" and "file" parameters are optional.

</details>

## **Get File**

Returns json data about file in a storage. Returns json data about files and folders within a folder that is a target of request

<details>

- **URL**

  /file/:id

- **Method:**

  `GET`

- **Headers:**

  `'Authorization': 'Bearer <JWT>'`

- **URL Params**

  **Required:**

  `id=[integer]`

- **Query Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:**
    ```json
    [
      {
        "id": 28,
        "name": "folder3",
        "size": 0,
        "info": "folder with photos",
        "filePath": "C:\\JS\\rs-clone-backend\\public\\user1\\folder1\\folder3",
        "parentPath": "C:\\JS\\rs-clone-backend\\public\\user1\\folder1",
        "type": "folder",
        "createdAt": "2023-02-26T16:01:00.128Z",
        "updatedAt": "2023-02-26T16:01:00.128Z",
        "userId": 1
      },
      {
        "id": 30,
        "name": "file14.jpg",
        "size": 245,
        "info": "flower photo",
        "filePath": "C:\\JS\\rs-clone-backend\\public\\user1\\folder1\\file14.jpg",
        "parentPath": "C:\\JS\\rs-clone-backend\\public\\user1\\folder1",
        "type": "file",
        "createdAt": "2023-02-26T16:01:48.663Z",
        "updatedAt": "2023-02-26T16:01:48.663Z",
        "userId": 1
      }
    ]
    ```

- **Error Response:**

  - **Code:** 400 BAD REQUEST<br />
  - **Content:**

    None

  OR

  - **Code:** 403 FORBIDDEN<br />

  - **Content:**

    Error: access to this resource is denied

  OR

  - **Code:** 500 INTERNAL SERVER ERROR<br />

  - **Content:**

    Error: cant't read file info from data base; can't read the children list of this folder from data base

- **Notes:**

  Request by ID can be performed for both folder and file

</details>

## **Get Root**

Returns json data about files and folders within a root user folder

<details>

- **URL**

  /file

- **Method:**

  `GET`

- **Headers:**

  `'Authorization': 'Bearer <JWT>'`

- **URL Params**

  **Required:**

  None

- **Query Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:**
    ```json
    [
      {
        "id": 19,
        "name": "slardar.jpg",
        "size": 520,
        "info": "killer",
        "filePath": "C:\\JS\\rs-clone-backend\\public\\user1\\slardar.jpg",
        "parentPath": "C:\\JS\\rs-clone-backend\\public\\user1",
        "type": "file",
        "createdAt": "2023-02-26T13:43:34.074Z",
        "updatedAt": "2023-02-26T13:43:34.074Z",
        "userId": 1
      },
      {
        "id": 26,
        "name": "folder2",
        "size": 0,
        "info": "folder with photos",
        "filePath": "C:\\JS\\rs-clone-backend\\public\\user1\\folder2",
        "parentPath": "C:\\JS\\rs-clone-backend\\public\\user1",
        "type": "folder",
        "createdAt": "2023-02-26T16:00:24.082Z",
        "updatedAt": "2023-02-26T16:00:24.082Z",
        "userId": 1
      },
      {
        "id": 27,
        "name": "folder3",
        "size": 0,
        "info": "documents",
        "filePath": "C:\\JS\\rs-clone-backend\\public\\user1\\folder3",
        "parentPath": "C:\\JS\\rs-clone-backend\\public\\user1",
        "type": "folder",
        "createdAt": "2023-02-26T16:00:43.510Z",
        "updatedAt": "2023-02-26T16:00:43.510Z",
        "userId": 1
      }
    ]
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED<br />
  - **Content:**

    User not authorized

  OR

  - **Code:** 403 FORBIDDEN<br />

  - **Content:**

    Error: access to this resource is denied

  OR

  - **Code:** 500 INTERNAL SERVER ERROR<br />

  - **Content:**

    Error: cant't read file info from data base; can't read the children list of this folder from data base

- **Notes:**

  None

</details>

## **Delete File**

Delete specified file or folder from a user storage

<details>

- **URL**

  /file/:id

- **Method:**

  `DELETE`

- **Headers:**

  `'Authorization': 'Bearer <JWT>'`

- **URL Params**

  **Required:**

  `id=[integer]`

- **Query Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:**
    ```json
    {
      "message": "file with id=25 deleted"
    }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED<br />
  - **Content:**

    User not authorized

  OR

  - **Code:** 403 FORBIDDEN<br />

  - **Content:**

    Error: access to this resource is denied

  OR

  - **Code:** 500 INTERNAL SERVER ERROR<br />

  - **Content:**

    Error: can't get access to file; can't delete folder; can't delete from data base

- **Notes:**

  Delete file from user storage. If target of request is a folder, all contents within a folder will be deleted

</details>
