import React from 'react';
import {getTrueInitials} from '../utilities/getTrueInitials';
import {getDarkMode} from '../utilities/getDarkMode';
import {isMobileAgent, getMobileAgent} from '../utilities/userAgent';
// it('returns without erroring', () => {
//     expect(getTrueInitials("Asriel Dreemurr")).toEqual("AD");
//     expect(getTrueInitials("🤔")).toEqual("MU");
// });

it('getDarkMode returns without erroring', () => {
    expect(getDarkMode()).toEqual("");
    localStorage.setItem("prefers-dark-mode", "true");
    expect(getDarkMode()).toEqual("dark");
});

it('isMobileAgent returns without erroring', () => {
    expect(isMobileAgent()).toBeDefined();
    expect(getMobileAgent()).toBeDefined();
})