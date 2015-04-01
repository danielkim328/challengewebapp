angular.module( 'appMain', [
	'app.config',
	'ui.router',
	'templates-app',
	'templates-common',
	'appMain.home',
	'appMain.about',
	'appMain.map',
	'appMain.mapFactory'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider  ) {
		$urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = toState.data.pageTitle + ' | appMain' ;
		}
	});
});