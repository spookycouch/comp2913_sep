import mysql.connector
import os
import subprocess
import unittest
import yaml

db_path = os.path.dirname(os.path.abspath(__file__)) + '/../../../src/central_system/sql/sep_db.sql'
db_name = 'sep_test_proc_1'
YAML_PATH = os.path.dirname(os.path.abspath(__file__)) + '/test_db.yaml'


class TestDb(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        # Connect to the MySQL server, and create new database for test sequence
        try:
            print 'CONNECTING TO MYSQL SERVER...',

            self.db = mysql.connector.connect(
                host='localhost',
                user='sep',
                passwd='sepword'
            )
            print 'SUCCESS!'


            print 'CREATING TEST DATABASE: ' + db_name +'\n'
            try:
                self.cursor = self.db.cursor()
                self.cursor.execute('DROP DATABASE IF EXISTS {}'.format(db_name))
                self.cursor.execute('CREATE DATABASE ' + db_name)
            except mysql.connector.errors.DatabaseError as e:
                print e
                assert False
            

            self.cursor.execute('USE ' + db_name)
            print 'IMPORTING FROM PROJECT SQL FILE...',
            p = subprocess.check_call('mysql -u sep --password=sepword {} < {}'.format(db_name, db_path), stderr=subprocess.PIPE, shell=True)
            print 'SUCCESS!'

        except mysql.connector.errors.ProgrammingError as e:
            print '\n', e
            assert False
        except subprocess.CalledProcessError as e:
            print
            print '\n', e
            assert False
        
        # load the yaml file with test cases
        self.test_cases = yaml.safe_load(open(YAML_PATH,'r'))

    

    def test_0_new_user(self):
        cases = self.test_cases['test_0']
        for case in cases:
            try:
                self.cursor.execute(case['command'])
                if not case['result']:
                    self.fail('query {} should throw an error'.format(command))

            except:
                if case['result']:
                    self.fail('query {} failed'.format(command))


    def test_1_new_activity(self):
        pass

    @classmethod
    def tearDownClass(self):
    # Drop the test database as it is no longer needed
        try:
            print
            print 'DROPPING TEST DATABASE: ' + db_name
            self.cursor.execute('DROP DATABASE ' + db_name)
        except mysql.connector.errors.ProgrammingError as e:
            print e

if __name__ == '__main__':
    unittest.main()