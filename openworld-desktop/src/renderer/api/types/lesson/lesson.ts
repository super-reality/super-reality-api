import { IStep } from "../step/step";
import Link from "../link/link";

export interface ILesson {
  parent: Link[];
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  difficulty: number;
  medias: string[];
  tags: string[];
  visibility: Link[];
  ownership: Link[];
  entry: string;
  steps: IStep[];
}
