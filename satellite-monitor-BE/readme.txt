step 1: clone repo
-> git clone https://github.com/Diagru25/satellite-monitor-BE.git
-> cd satellite-monitor-BE

step 2: cài đặt virtualenv
-> pip install virtualenv (nếu lỗi) -> pip install --user pipenv -> pip install virtualenv
-> virtualenv venv (nếu lỗi) -> python -m venv venv

step 3: chạy môi trường ảo (nếu lỗi -> step 4)
(cmd) -> venv\Scripts\activate.bat
(power shell) -> .\venv\Scripts\activate

step 4: cho phép chạy môi trường ảo (không lỗi -> bỏ qua bước này)
-> Set-ExecutionPolicy Unrestricted -Scope Process

step 5: cài đặt các thư viện
-> pip install -r requirements

step 6:
-> cd src
-> python app.py

