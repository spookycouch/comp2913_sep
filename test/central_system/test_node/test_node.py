import unittest
import requests
import json
import yaml
import os
import mysql.connector
import subprocess

HOST = 'http://127.0.0.1:3000'
HEADERS = {'content-type': 'application/json'}
YAML_PATH = os.path.dirname(os.path.abspath(__file__)) + '/test_node.yaml'
db_path = os.path.dirname(os.path.abspath(__file__)) + '/../../../src/central_system/sql/sep_db.sql'
db_name = 'comp2913_sep'

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


    def test_0_register(self):
        url = HOST + '/api/register'
        cases = self.test_cases['test_0']

        for case in cases:
            payload = json.dumps(case['payload'])
            resp = requests.post(url, data=payload, headers=HEADERS)
            if resp.text == 'true':
                if not case['result']:
                    self.fail('invalid request {} should return an error'.format(case['payload']))
            elif case['result']:
                self.fail('valid request {} failed'.format(case['payload']))
    

    def test_1_login(self):
        url = HOST + '/api/login'
        cases = self.test_cases['test_1']
        for case in cases:
            payload = json.dumps(case['payload'])
            resp = requests.post(url, data=payload, headers=HEADERS)
            resp_json = json.loads(resp.text)
            if type(resp_json) == dict:
                if not case['result']:
                    self.fail('invalid request {} should return an error'.format(case['payload']))
            elif case['result']:
                self.fail('valid request {} failed'.format(case['payload']))


    @classmethod
    def tearDownClass(self):
    # Drop the test database as it is no longer needed
        pass


if __name__ == '__main__':
    unittest.main()