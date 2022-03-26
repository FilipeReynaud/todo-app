import logging

import psycopg2

from config import settings


class DBClient(object):

    def __init__(self, *, host, port, database, user, password, logger=None):
        self._host = host
        self._port = port
        self._database = database
        self._user = user
        self._password = password
        self._conn = None
        self._logger = logger or logging.getLogger(__name__)

    @property
    def password(self):
        return self._password

    def create_connection(self, set_conn=False):
        conn = psycopg2.connect(host=self._host,
                                port=self._port,
                                database=self._database,
                                user=self._user,
                                password=self.password)
        if set_conn:
            self._conn = conn
        return conn

    def close_connection(self, conn=None):
        is_self_conn = conn is None
        conn = conn or self._conn
        if conn is None:
            return
        try:
            conn.close()
            if is_self_conn:
                self._conn = None
        except Exception:
            pass

    def commit_connection(self, conn=None, close=True):
        is_self_conn = conn is None
        conn = conn or self._conn
        if conn is None:
            return
        conn.commit()
        if close:
            self.close_connection(conn=None if is_self_conn else conn)

    def rollback_connection(self, conn=None, close=True):
        is_self_conn = conn is None
        conn = conn or self._conn
        if conn is None:
            return
        conn.rollback()
        if close:
            self.close_connection(conn=None if is_self_conn else conn)

    def execute_query(self, sql, params=None, fetch=False, conn=None):
        params = params or {}
        conn = conn or self._conn
        if conn is None:
            conn = self.create_connection()
            with conn, conn.cursor() as cur:
                query = cur.mogrify(sql, params)
                if self._logger is not None:
                    decoded_query = query.decode()
                    if len(decoded_query) > settings.LOG_SQL_MAX_SIZE:
                        self._logger.debug(
                            f"Executing SQL: {decoded_query[:settings.LOG_SQL_MAX_SIZE]} ..."
                        )
                        self._logger.warning(
                            f"Executed SQL not fully logged due to max size setting ({settings.LOG_SQL_MAX_SIZE})"
                        )
                    else:
                        self._logger.debug(f"Executing SQL: {decoded_query}")
                cur.execute(query)
                if fetch:
                    results = cur.fetchall()
                    if self._logger is not None:
                        self._logger.debug(f"Rows fetched: {len(results)}")
                    return results
            self.close_connection(conn)
        else:
            with conn.cursor() as cur:
                query = cur.mogrify(sql, params)
                if self._logger is not None:
                    decoded_query = query.decode()
                    if len(decoded_query) > settings.LOG_SQL_MAX_SIZE:
                        self._logger.debug(
                            f"Executing SQL: {decoded_query[:settings.LOG_SQL_MAX_SIZE]} ..."
                        )
                        self._logger.warning(
                            f"Executed SQL not fully logged due to max size setting ({settings.LOG_SQL_MAX_SIZE})"
                        )
                    else:
                        self._logger.debug(f"Executing SQL: {decoded_query}")
                cur.execute(query)
                if fetch:
                    results = cur.fetchall()
                    if self._logger is not None:
                        self._logger.debug(f"Rows fetched: {len(results)}")
                    return results
