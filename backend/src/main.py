from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from flask import render_template

import os
import sys
sys.path.append(os.getcwd())
from db.authentication_utils import check_login_credentials, insert_user_credentials, create_auth_token, reset_auth_token,token_validation, get_username
from db.profile_page_utils import get_profile_details, update_profile_details, insert_profile_details, delete_user_account, update_profile_image

def make_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/sign_up", methods=["POST"])
    def create_account():
        
        username=request.headers.get("username")
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = insert_user_credentials(username, email,password)
       
        if status is False:
            return jsonify("Email or Username already exists!")
        elif status == "Invalid Email":
            return jsonify("Invalid Email!")


        auth_token = create_auth_token(username)
        #insert email and username to profile_table
        insert_profile_details(email, username)

        # return username and token
        return jsonify(username=username, auth_token=auth_token)

    @app.route("/login", methods=["POST"])
    def check_login():
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = check_login_credentials(email,password)

        if status is False:
            return jsonify("Incorrect Password or Email!")

        # Get username based on the email
        username=get_username(email)

        # Create auth token based on username
        auth_token = create_auth_token(username)
        
        # return username and token
        return jsonify(username=username, auth_token=auth_token)

    @app.route("/logout", methods=["POST"])
    def log_out():
        
        username=request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        #reset authentication token associated with the username once user logs out
        if reset_auth_token(username, auth_token):
            return jsonify("success")
        else:
            return jsonify("failed")


    @app.route("/get_profile_page", methods=["POST"])
    def get_user_profile():
        # This is the user's username
        username=request.headers.get("username")
        # This is the username of the profile we want to get
        profile_user=request.headers.get("profile_user")
        print("profile_user:"+profile_user)
        # This is auth token front frontedn
        auth_token=request.headers.get("auth_token")

        # if username=="null" or profile_user=="null" or auth_token=="null":
        #     return jsonify("failed")

        # Check if the user is logged in, check the auth token
        if username!="null":
             # verify the token with username
            status = token_validation(username, auth_token)
            # print(status)
            if status:
                profile_details = get_profile_details(profile_user)
                return jsonify(profile_details)
            else:
                return jsonify("failed")
        # If the user is not logged in and it requests other user's profile
        else:
            profile_details=get_profile_details(profile_user)
            return jsonify(profile_details)


       


    @app.route("/update_profile_page", methods=["POST"])
    def update_profile():
        email = request.headers.get("email")
        username=request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        phone_number = request.headers.get("tel")
        age = request.headers.get("age")
        about = request.headers.get("about")


        #check if the authentication token is valid
        status = token_validation(username, auth_token)
        if status:
            #update database with the related fields. 
            update_status=update_profile_details(username, email, phone_number, age, about)
            if update_status==False:
                return jsonify("This email already used!")

            return jsonify("success")

        else:
            return jsonify("failed")
    

    # Update user's profile image
    @app.route("/update_profile_avatar", methods=["POST"])
    def update_profile_avatar():
        username=request.headers.get("username")
        auth_token=request.headers.get("auth_token")
        image=request.headers.get("image")

        # print("image is", image)

        status = token_validation(username, auth_token)
        if status:
            update_profile_image(username, image)
            
            return jsonify("success")

        else:
            return jsonify("failed")



    @app.route("/delete", methods=["POST"])
    def delete_user():
        username=request.headers.get("username")
        auth_token = request.headers.get("auth_token")

        #check if the authentication token is valid
        status = token_validation(username, auth_token)
        
        if status:
            delete_user_account(username) 
            return jsonify("success")

        else:
            return jsonify("failed")


    return app
