import psycopg2

url_ssl = "postgresql://event_management_db_gdyq_user:olCkEp0BSk7DK5ru4zHwmvJ0Dp1LBG7x@dpg-d6h8t815pdvs73ddfa80-a.oregon-postgres.render.com/event_management_db_gdyq"

try:
    print("Testing psycopg2 directly...")
    conn = psycopg2.connect(url_ssl, sslmode='require')
    print("Success!")
    conn.close()
except Exception as e:
    print("Error:", e)
