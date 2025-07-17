import os
import json
import uuid
from django.conf import settings

EMPLOYEE_JSON = getattr(settings, "EMPLOYEE_JSON_PATH", "employees.json")

def _ensure_file():
    if not os.path.exists(EMPLOYEE_JSON):
        with open(EMPLOYEE_JSON, "w") as f:
            json.dump([], f)

# PUBLIC_INTERFACE
def get_all_employees():
    _ensure_file()
    with open(EMPLOYEE_JSON, "r") as f:
        return json.load(f)

# PUBLIC_INTERFACE
def save_all_employees(employee_list):
    with open(EMPLOYEE_JSON, "w") as f:
        json.dump(employee_list, f, indent=2)

# PUBLIC_INTERFACE
def get_employee_by_id(emp_id: str):
    emps = get_all_employees()
    for emp in emps:
        if str(emp["id"]) == str(emp_id):
            return emp
    return None

# PUBLIC_INTERFACE
def add_employee(employee_data):
    emps = get_all_employees()
    new_emp = employee_data.copy()
    new_emp["id"] = str(uuid.uuid4())
    emps.append(new_emp)
    save_all_employees(emps)
    return new_emp

# PUBLIC_INTERFACE
def update_employee(emp_id, updated_data):
    emps = get_all_employees()
    for idx, emp in enumerate(emps):
        if str(emp["id"]) == str(emp_id):
            updated_data["id"] = str(emp_id)
            emps[idx] = updated_data
            save_all_employees(emps)
            return updated_data
    return None

# PUBLIC_INTERFACE
def delete_employee(emp_id):
    emps = get_all_employees()
    new_emps = [emp for emp in emps if str(emp["id"]) != str(emp_id)]
    if len(new_emps) != len(emps):
        save_all_employees(new_emps)
        return True
    return False
