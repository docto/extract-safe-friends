chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		const MESSAGE_BOX_ID = "PRenPie";
		const LOAD_WAIT_TIME = 1000 // Could be more. 

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
					
					var user = { 
						name: current_user.text,
						safe: safe_when
					}
	
					all_safe_users.push(user)
				}
	
				updateMessageBox("Done");
				console.log("\n\n");
				console.log(JSON.stringify(all_safe_users))
			} else {
				updateMessageBox("No safe friends found");				
			}

			
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

	}
	}, 10);
});