#!/bin/bash

# Current Directory:
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Execute command based on input
case "${1}"
	in 
	client) 
		cd $DIR/app/client 
		npm start $DIR/app/client/src/App.js
		;;

	server) 
		cd $DIR/app/server
		PGUSER=postgres PGHOST=localhost PGPASSWORD=maddie17 PGDATABASE=Rabbithole-proto PGPORT=5432 node $DIR/app/server/src/app.js
		;;

	server-debug) 
		cd $DIR/app/server
		PGUSER=postgres PGHOST=localhost PGPASSWORD=maddie17 PGDATABASE=Rabbithole-proto PGPORT=5432 node --inspect-brk $DIR/app/server/src/app.js
		;;

	pgadmin) 
		source ~/pgadmin4/bin/activate 
		python3 ~/pgadmin4/lib/python3.7/site-packages/pgadmin4/pgAdmin4.py
		;;

	*) 
		echo "Unrecognized argument passed: $1"
		echo "Should be one of: [client, server, pgadmin]"

esac

## see screen usage information from here: 
## https://superuser.com/questions/1347169/shell-script-run-screen-open-several-screens-and-run-a-command-in-each

# # Launch new screen 
# screen -d -m -S Rabbithole

# # Launch Client:
# screen -S mysession -X screen -t win1
# screen -S mysession -p win1 -X exec npm start $DIR/client/src/App.js

# # Launch Server: 
# screen -S mysession -X screen -t win2 
# screen -S mysession -p win2 -X exec PGUSER=postgres PGHOST=localhost PGPASSWORD=maddie17 PGDATABASE=Rabbithole-proto PGPORT=5432 node $DIR/server/src/app.js

# # Launch PgAdmin4:
# screen -S mysession -X screen -t win3
# screen -S mysession -p win3 -X exec pgadmin 


