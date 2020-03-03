import unittest
import requests
import json
import yaml

HOST = 'http://127.0.0.1:3000'
HEADERS = {'content-type': 'application/json'}

class TestNode(unittest.TestCase):
    @classmethod
    def setUpClass(self):
    # load test yaml
        self.test_cases = yaml.safe_load(open('test_node.yaml','r'))


    def test_0_register(self):
        url = HOST + '/user/register'
        cases = self.test_cases['test_0']
        for case in cases:
            payload = json.dumps(case['payload'])
            resp = requests.post(url, data=payload, headers=HEADERS)

    def test_1_login(self):
        url = HOST + '/user/register'
        cases = self.test_cases['test_0']
        for case in cases:
            payload = json.dumps(case['payload'])
            resp = requests.post(url, data=payload, headers=HEADERS)

    @classmethod
    def tearDownClass(self):
    # Drop the test database as it is no longer needed
        pass


if __name__ == '__main__':
    unittest.main()