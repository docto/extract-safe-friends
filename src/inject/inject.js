chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		const MESSAGE_BOX_ID = "PRenPie";
		const LOAD_WAIT_TIME = 1500 // Could be more. 

		createMessageBox();
		
		var all_safe_users = [];		
		var tab_btn = document.querySelectorAll('a[role="tab"]')[1];
		tab_btn.click();
		 
		setTimeout(scrollToBottom, LOAD_WAIT_TIME)

		function scrollToBottom(){
			var currentHeight = document.body.scrollHeight;
			document.body.scrollTop = document.body.scrollHeight;

			setTimeout(function(){
				if(currentHeight != document.body.scrollHeight) {
					updateMessageBox("Fetching more friends...");
					scrollToBottom()
				} else {
					getSafeUsers()
				}
			}, LOAD_WAIT_TIME)
		}
		
		function getSafeUsers(){

			updateMessageBox("Finished fetching friends...");
			
			var visible_users = document.querySelectorAll('[data-hovercard]');

			if(visible_users.length > 0) {
				for (var i = 0, all = visible_users.length; i < all; i++) {
					var current_user = visible_users[i];
					var safe_when = current_user.parentElement.parentElement.childNodes[2].textContent;
					
					// Split Name into First & Last Name(s). Assume first word is name
					var user = fullNameToObject(current_user.text)
					user.safe= safe_when
	
					all_safe_users.push(user)
				}
	
				updateMessageBox("Downloading CSV...");
				downloadCSV({filename: "safe-friends.csv"})
			} else {
				updateMessageBox("No safe friends found");				
			}
		}

		function fullNameToObject(full_name){
			var full_name = full_name.split(" ");
			var final_object = {}

			switch (full_name.length) {
				case 1:
					final_object.name = full_name[1]
				break;
				case 2:
					final_object = {
						nombre: full_name[0],
						apellido: full_name[1]
					}
				break;
				default: 
					final_object = {
						nombre: full_name[0],
						apellido: ""
					}

					for(var i = 1, all = full_name.length; i < all; i++) {
						final_object.apellido += full_name[i] + " "
					}
			}

			return final_object
		}

		function createMessageBox(){
			var newBox = document.createElement('div');
			newBox.id = MESSAGE_BOX_ID
			newBox.style.cssText = "position: fixed; top: 0; right: 0; color: #fff; width: 205px; background-color: #00AFEC; height: 90px;z-index: 99999; text-align: center; height: 42px;"
			newBox.innerText = "Waiting for page to load..."

			document.getElementById('pagelet_bluebar').appendChild(newBox)
		}

		function updateMessageBox(text){
			document.getElementById(MESSAGE_BOX_ID).innerHTML = text
		}
		
		function convertArrayOfObjectsToCSV(args) {  
			var result, ctr, keys, columnDelimiter, lineDelimiter, data;
	
			data = args.data || null;
			if (data == null || !data.length) {
				return null;
			}
	
			columnDelimiter = args.columnDelimiter || ',';
			lineDelimiter = args.lineDelimiter || '\n';
	
			keys = Object.keys(data[0]);
	
			result = '';
			result += keys.join(columnDelimiter);
			result += lineDelimiter;
	
			data.forEach(function(item) {
				ctr = 0;
				keys.forEach(function(key) {
					if (ctr > 0) result += columnDelimiter;
	
					result += item[key];
					ctr++;
				});
				result += lineDelimiter;
			});
	
			return result;
		}

		function downloadCSV(args) {  
			var data, filename, link;
			var csv = convertArrayOfObjectsToCSV({
				data: all_safe_users
			});
			if (csv == null) return;
	
			filename = args.filename || 'export.csv';
	
			if (!csv.match(/^data:text\/csv/i)) {
				csv = 'data:text/csv;charset=utf-8,' + csv;
			}
			data = encodeURI(csv);
	
			link = document.createElement('a');
			link.setAttribute('href', data);
			link.setAttribute('download', filename);
			link.click();
		}

	}
	}, 10);
});