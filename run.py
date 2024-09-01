from app import create_app
from init_db import init_db
import sys

app = create_app()

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--init-db':
        init_db()
    else:
        app.run(host='0.0.0.0', port=5001, debug=True)