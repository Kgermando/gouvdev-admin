import { CanActivateFn } from '@angular/router'; 
 
export const dashboardGuard: CanActivateFn = (route, state) =>  {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Dashboard')) { 
    access = true;
  }  
  return access; 
};

export const cohortesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Cohortes')) { 
    access = true;
  }    
  return access; 
};

export const banquesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Banques')) { 
    access = true;
  }    
  return access; 
};

export const beneficiairesGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Beneficiaires')) { 
    access = true;
  }    
  return access; 
};

export const usersGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('users')) { 
    access = true;
  }    
  return access; 
};

export const configurationGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Configuration')) { 
    access = true;
  }    
  return access; 
};


export const supportGuard: CanActivateFn = (route, state) => {
  let roles = localStorage.getItem('roles');
  let roleList = JSON.parse(roles!) 
  let access = false; 
  if (roleList.includes('Support')) { 
    access = true;
  }     
  return access;  
};
