# Employee Management System (EMS) Monolith

A demo Employee Management System built with Django (backend) and React/MUI (frontend). 

## To Run

1. **Backend**
   - `cd backend`
   - `pip install -r ../requirements.txt`
   - `python manage.py migrate`
   - `python manage.py runserver 0.0.0.0:8000`

2. **Frontend**
   - `cd frontend`
   - `npm install`
   - `npm start`

Admin credentials can be added via `python manage.py createsuperuser`.

**Features:**
- Auth via Django JWT
- CRUD employee management stored in JSON files
- REST API
- Responsive design
- Form validation
