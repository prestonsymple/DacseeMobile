/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>

#import <MAMapKit/MAMapKit.h>
#import <AMapFoundationKit/AMapFoundationKit.h>

#import <Bugly/Bugly.h>
#import <RCTSplashScreen/RCTSplashScreen.h>

#import "RNUMConfigure.h"
#import <UMShare/UMSocialManager.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // #######################################################
  [Bugly startWithAppId: @"dc96c9eb54"];
  [AMapServices sharedServices].apiKey = @"b06eec333302b4faf9ae7397e273bc12";
  
  [UMConfigure setLogEnabled:YES];
  [RNUMConfigure initWithAppkey:@"5a7aa3f2a40fa355a700002a" channel:@"App Store"];
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_QQ appKey:@"1106730946" appSecret:@"cpXqcASFJs2r6vH3" redirectURL:nil];
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Twitter appKey:@"75sUPCwmmjb7R4VP8F7mIly8B" appSecret:@"gBpNFDJ07FGO5dPQ8zlUFyzrr3KWd82RE6HWVQzyNfiXNbRyCX" redirectURL:nil];
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Facebook appKey:@"189854555110129" appSecret:@"5242579ad95a1347a9a55be82156e810" redirectURL:nil];
  // #######################################################
  
  NSURL *jsCodeLocation;
  #ifdef DEBUG
    [[RCTBundleURLProvider sharedSettings] setJsLocation: @"192.168.80.100"];
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [CodePush bundleURL];
  #endif
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"dacsee"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  
  [RCTSplashScreen show:rootView];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

//-(void) setLaunchScreen {
//  [self.window makeKeyAndVisible];
//  lunchView = [[NSBundle mainBundle ] loadNibNamed:@"LaunchScreen" owner:nil options:nil][0];
//  lunchView.frame = CGRectMake(0, 0, self.window.screen.bounds.size.width, self.window.screen.bounds.size.height);
//  [self.window addSubview:lunchView];
//  UIImageView *imageV = [[UIImageView alloc] initWithFrame:CGRectMake(0, 50, 320, 300)];
//  NSString *str = @"http://club.dayoo.com/club_data/upload_photo/rtys/2008/07/21/988/2473.gif"; [imageV sd_setImageWithURL:[NSURL URLWithString:str] placeholderImage:[UIImage imageNamed:@"default1.jpg"]];
//  [lunchView addSubview:imageV];
//  [self.window bringSubviewToFront:lunchView];
//  [NSTimer scheduledTimerWithTimeInterval:6 target:self selector:@selector(removeLun) userInfo:nil repeats:NO];
//  return YES;
//}

@end
