from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime as dt
from sqlalchemy import(
    Column,
    Boolean,
    String,
    Integer,
    Float,
    DateTime,
    JSON,
    ARRAY,
    ForeignKey
)

Base = declarative_base()

class User_Credentials(Base):
    __tablename__ = "user_credentials"
    username = Column (String, primary_key=True ,nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    auth_token = Column(String, nullable=True)
    followers = Column(String, nullable=True)
    following = Column(String, nullable=True)
    topics_following = Column(String, nullable=True)
    

class Profile_Page(Base):
    __tablename__ = "profile_page"
    username = Column(String, primary_key=True, nullable=False)
    email = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    age = Column(String, nullable=True)
    about = Column(String, nullable=True)
    image=Column(String, nullable=True)


class Posts(Base):
    __tablename__ = "posts"
    post_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    likes = Column(Integer, nullable=True)
    dislikes = Column(Integer, nullable=True)
    date_created = Column(String, nullable=True)
    topics = Column(String, nullable=True)


class Comments(Base):
    __tablename__ = "comments"
    username = Column(String, primary_key=True, nullable=False)
    post_id = Column(Integer, nullable=False)
    comment = Column(String, nullable=False)


if __name__ == "__main__":
    pass