var connectionHandlers = {
    sign_in_info : function(data){
        if(data.success){
            info("Logged-in successfully !", 2);
        }
        else{
            switch (data.errorField) {
                case 'username':
                    info("User not found with this username.", 2);
                    break;

                case 'password':
                    info("Wrong password entered.", 2);
                    break;

                default:
                    info("Could not connect.", 2);
                    break;
            }
        }
    },

    sign_up_info: function(data){
        if(data.success){
            info("Signed-up in successfully !", 2);
        }
        else{
            switch (data.errorField) {
                case 'username':
                    info("Username already exists.", 2);
                    break;

                default:
                    info("Could not sign-up.", 2);
                    break;
            }
        }
    },

    not_logged_in: function(){
        info("You are not signed-in !", 2);
    }
}