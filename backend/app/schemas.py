from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    phone_number: Optional[str] = None
    profile_photo: Optional[str] = None
    notification_email: bool
    notification_sms: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    profile_photo: Optional[str] = None
    notification_email: Optional[bool] = None
    notification_sms: Optional[bool] = None
    password: Optional[str] = None
    is_superuser: Optional[bool] = None
    is_active: Optional[bool] = None

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Password Schemas
class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    frontend_url: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

# Service Schemas
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: str

class ServiceCreate(ServiceBase):
    pass

class ServiceOut(ServiceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Booking Schemas
class BookingBase(BaseModel):
    service_id: int
    event_date: datetime
    time: Optional[str] = None
    location: Optional[str] = None
    package: Optional[str] = None
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: str

class BookingOut(BookingBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    service: ServiceOut

    class Config:
        from_attributes = True

# Gallery Schemas
class GalleryBase(BaseModel):
    title: Optional[str] = None
    image_url: str

class GalleryCreate(GalleryBase):
    pass

class GalleryOut(GalleryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Contact Schemas
class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactMessageOut(ContactMessageCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Like Schemas
class LikeToggle(BaseModel):
    image_url: str

class LikeOut(BaseModel):
    id: int
    user_id: int
    image_url: str
    created_at: datetime
    
    class Config:
        from_attributes = True
