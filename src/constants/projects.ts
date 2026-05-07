import { Project } from '../types';
import { metavix } from '../data/projects/metavix';
import { elobike } from '../data/projects/elobike';
import { goodStorage } from '../data/projects/good-storage';
import { auddar } from '../data/projects/auddar';
import { lionJump } from '../data/projects/lion-jump';
import { scallaRecords } from '../data/projects/scalla-records';

export const METAVIX_PROJECT = metavix;
export const ELOBIKE_PROJECT = elobike;
export const GOOD_STORAGE_PROJECT = goodStorage;
export const AUDDAR_PROJECT = auddar;
export const LION_JUMP_PROJECT = lionJump;
export const SCALLA_RECORDS_PROJECT = scallaRecords;

export const PROJECTS_LIST: Project[] = [
  METAVIX_PROJECT,
  ELOBIKE_PROJECT,
  GOOD_STORAGE_PROJECT,
  AUDDAR_PROJECT,
  LION_JUMP_PROJECT,
  SCALLA_RECORDS_PROJECT
];
