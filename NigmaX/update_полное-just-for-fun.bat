chcp 65001 && java -jar NigmaX.jar --dbname database/just-for-fun.sqlite --console --skipmlctest -d parsers/just-for-fun.json -all -removebroken update [all]

chcp 65001 && java -jar NigmaX.jar --dbname database/just-for-fun.sqlite --console -d parsers/just-for-fun.json export 


pause
exit /b