import unittest
import requests
import json
import yaml
import os

HOST = 'http://127.0.0.1:3000'
HEADERS = {'content-type': 'application/json'}
YAML_PATH = os.path.dirname(os.path.abspath(__file__)) + '/test_node.yaml'


class TestNode(unittest.TestCase):
    @classmethod
    def setUpClass(self):
    # load test yaml
        self.test_cases = yaml.safe_load(open(YAML_PATH,'r'))


    def test_0_register(self):
        url = HOST + '/api/register'
        cases = self.test_cases['test_0']
        for case in cases:
            payload = json.dumps(case['payload'])
            resp = requests.post(url, data=payload, headers=HEADERS)
            print resp

    def test_1_login(self):
        url = HOST + '/api/login'
        cases = self.test_cases['test_1']
        for case in cases:
            payload = json.dumps(case['payload'])
            resp = requests.post(url, data=payload, headers=HEADERS)
            print resp.text

    @classmethod
    def tearDownClass(self):
    # Drop the test database as it is no longer needed
        pass


if __name__ == '__main__':
    unittest.main()