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

#import <MAMapKit/MAMapKit.h>
#import <AMapFoundationKit/AMapFoundationKit.h>

#import <Bugly/Bugly.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // #######################################################
  [self nativeInit];
  
  // #######################################################
  NSURL *jsCodeLocation;
  #ifdef DEBUG
//    [[RCTBundleURLProvider sharedSettings] setJsLocation: @"192.168.43.251"];
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [CodePush bundleURL];
  #endif
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"dacsee"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [NSThread sleepForTimeInterval: 3]; // 延迟LAUNCH
  return YES;
}

-(void) nativeInit {
  [Bugly startWithAppId: @"dc96c9eb54"];
  [AMapServices sharedServices].apiKey = @"b06eec333302b4faf9ae7397e273bc12";
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
