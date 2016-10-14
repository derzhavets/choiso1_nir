
angular.module('choiso').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    
    
    $urlRouterProvider.otherwise("/dashboard");
    $locationProvider.html5Mode(true);
    
    $stateProvider

        // Main view
        .state('app', {
            abstract: true,
            url: "",
            templateUrl: "admin/app/views/common/content_top_navigation.html",
            resolve: {
                data: function(Data) {
                    return Data.get();
                }
            },
        })
    
    
    
    
        // Dashboard
        .state('app.dashboard', {
            url: "/dashboard",
            templateUrl: "admin/app/views/dashboard.html",
            controller: 'dashboardCtrl',
            data: { pageTitle: 'Dashbord' }
        })
    
        // Alternatives 
        .state('app.alternatives', {
            url: "/alternatives",
            templateUrl: "admin/app/views/alternatives.html",
            controller: 'alternativesCtrl',
            data: { pageTitle: 'Alternatives ' }
        })
    
        // Mirror 
        .state('app.mirror', {
            url: "/mirror",
            templateUrl: "admin/app/views/mirror.html",
            controller: 'mirrorCtrl',
            data: { pageTitle: 'Mirror ' }
        })
    
    /*
        // communications 
        .state('app.communications', {
            url: "/communications",
            templateUrl: "admin/app/views/communications.html",
            controller: 'communicationsCtrl',
            data: { pageTitle: 'Communications ' }
        })
    */
    
        // Users
        .state('app.profile', {
            url: "/profile",
            templateUrl: "admin/app/views/profile.html",
            controller: 'profileCtrl',
            resolve: {
                profile: function(User) {
                    return User.get();
                }
            },
            data: { pageTitle: 'Users' }
        })
    
        
    
        /// Authentication
        .state('login', {
            url: "/login",
            controller: 'loginCtrl',
            templateUrl: "admin/app/views/login.html",
            data: { pageTitle: 'Login', specialClass: 'gray-bg' }
        })
        .state('forgot-password', {
            url: "/forgot-password",
            templateUrl: "admin/app/views/forgot_password.html",
            data: { pageTitle: 'Forgot password', specialClass: 'gray-bg' }
        })
    
      
        
})

    
.run(function($rootScope, $state, User) {

    if(window.user && window.user._id){
        User.set(window.user);
    } 

     $rootScope.$on('$stateChangeStart', (event, toState) =>{ 
        if(!User.isLoggedIn() && toState.name !== 'login'){
            event.preventDefault();
            $state.go('login'); 
        }  else if(User.isLoggedIn() && toState.name === 'login'){
            event.preventDefault();
            $state.go('app.dashboard'); 
        } 
         
    });
    
    

    $rootScope.$state = $state;
    
    
});