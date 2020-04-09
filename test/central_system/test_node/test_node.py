import unittest
import requests
import json
import yaml
import os
import mysql.connector
import subprocess

HOST = 'http://127.0.0.1:3000'
HEADERS = {'content-type': 'application/json'}
# CSURF COMBINATION THAT ACTUALLY WORKS
COOKIES =  {'_csrf' : 'plshelpme'}
CSRF_TOKEN = 'iSIzC89x-luXTapA58TaKgGNEokgJUVSTLj4'

YAML_PATH = os.path.dirname(os.path.abspath(__file__)) + '/test_node.yaml'
db_path = os.path.dirname(os.path.abspath(__file__)) + '/../../../src/central_system/sql/sep_db.sql'
db_name = 'comp2913_sep'

def json_from_case(case):
    payload = case['payload']
    payload['_csrf'] = CSRF_TOKEN
    return json.dumps(payload)


class TestNode(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        print 'CONNECTING TO MYSQL SERVER...',

        self.db = mysql.connector.connect(
                host='localhost',
                user='web_comp2913'
        )
        print 'SUCCESS!'

        print 'DELETING EXISTING DATABASE: ' + db_name +'\n'
        try:
            self.cursor = self.db.cursor()
            self.cursor.execute('DROP DATABASE IF EXISTS {}'.format(db_name))
        except mysql.connector.errors.DatabaseError as e:
            print e
            assert False
        

        print 'IMPORTING FROM PROJECT SQL FILE...',
        p = subprocess.check_call('mysql -u sep --password=sepword < {}'.format(db_path), stderr=subprocess.PIPE, shell=True)
        print 'SUCCESS!'

        print 'USING IMPORTED DATABASE: ' + db_name + '\n'
        self.cursor.execute('USE {}'.format(db_name))

        # load test yaml
        self.test_cases = yaml.safe_load(open(YAML_PATH,'r'))


    def test_0_register_and_login(self):
        url = HOST + '/user/register'
        cases = self.test_cases['test_0_0']

        for case in cases:
            payload = json_from_case(case)
            resp = requests.post(url, data=payload, headers=HEADERS, cookies=COOKIES)

            passed = True
            for line in resp.text.split('\n'):
                if 'error' in line and 'none' not in line:
                    passed = False

            
            # valid logins should pass
            # invallid logins should throw an error
            if case['result'] and not passed:
                self.fail('valid login {} failed'.format(case['payload']))
            if not case['result'] and passed:
                self.fail('invalid login {} should throw an error'.format(case['payload']))
        
    
        url = HOST + '/user/login'

        cases = self.test_cases['test_0_1']
        for case in cases:
            payload = json_from_case(case)
            resp = requests.post(url, data=payload, headers=HEADERS, cookies=COOKIES)
            
            passed = True
            for line in resp.text.split('\n'):
                # valid logins should pass
                if 'error' in line and 'none' not in line:
                    passed = False

            # valid logins should pass
            # invallid logins should throw an error
            if case['result'] and not passed:
                self.fail('valid login {} failed'.format(case['payload']))
            if not case['result'] and passed:
                self.fail('invalid login {} should throw an error'.format(case['payload']))


    @classmethod
    def tearDownClass(self):
    # Drop the test database as it is no longer needed
        pass


if __name__ == '__main__':
    unittest.main()