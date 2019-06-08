# SCV-API

### About Digicel SCV-API?

Digicel SCV is a Single Customer View used by its agents to deliver customer administration and support.
Imeplemnted through a responsive and mobile-first **Progressive Web App (PWA)**, Digicel SCV is built using the **MEAN stack**.
As such, the following environment is used:

 - Front-End
   - Angular 8
 - Back-End (RESTful API)
   - Node 10.15.3
   - Express 4.17.1
   - MongoDB 4.0.10
 - Development OS: Windows 10 Home (64-bit)

### How to run the SCV RESTful API

#### Prepare your environment 

To run the API on your local environment, do the following:
 1. Install the LTS (Recommended) version of Node.js: https://nodejs.org/en/download/
 
#### Setting up MongoDB Atlas
 
 1. Create a free account on MongoDB Atlas: https://www.mongodb.com/cloud/atlas
    After creating the account, you'll be guided through the setup of the cloud environment for your MongoDB cluster.
    For this project, the following was done:
     i. The default (**AWS**) was chosen as the **Cloud Provider**
     ii. The default (**N. Vaginia (us-east-1)**) was chosen as the **Region**
 2. Give your **cluster** a name and create it *(The process takes approximately 7 to 10 minutes)*
 3. Navigate to **SECURITY** > **Database Access** and create a **MongoDB User** to manage your database.
 4. Navigate to **SECURITY** > **Network Access** and add your **IP Address** to the **IP Whitelist**.
 5. Navigate to **ATLAS** > **Clusters** and click the *name of your cluster* to access your *cluster nodes*.
 6. You should see **(3) nodes** named in the format: *<cluster name>-shard-00-00-<unique id>.mongodb.net:27017*
    i. For each node, click it's name and you'll be nnavigated to the node's *dashboard*. Copy the name of each node and save. (You'll need them to connect to your MongoDB cluster.
    ii. Note the *username* and **password** of the user account your created in *step (3)*. (You'll need them to connect to your MongoDB cluster.
    
