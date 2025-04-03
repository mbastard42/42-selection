import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { KeyService } from '../key/key.service';

type Behavior = () => void;

class ELEM {

    up: ELEM | undefined = undefined;
    down: ELEM | undefined = undefined;
    left: ELEM | undefined = undefined;
    right: ELEM | undefined = undefined;
    next: ELEM | undefined = undefined;
    prev: ELEM | undefined = undefined;

    upBehavior: Behavior | undefined = undefined;
    downBehavior: Behavior | undefined = undefined;
    leftBehavior: Behavior | undefined = undefined;
    rightBehavior: Behavior | undefined = undefined;
    nextBehavior: Behavior | undefined = undefined;
    prevBehavior: Behavior | undefined = undefined;

    constructor(public route: string) {}
}

@Injectable({
    providedIn: 'root'
})
export class NavService {

    keyService: KeyService;

    head: ELEM | undefined;
    private ElemMap: Map<string, ELEM>;

    private pageChangeBehavior: (newRoute: string) => void;

    constructor(private router: Router) {

        this.keyService = new KeyService();
        this.head = undefined;
        this.ElemMap = new Map<string, ELEM>();
        this.pageChangeBehavior = (newRoute: string) => {};
        this.keyService.setKey({id: 'up', behaviorId: 'moveUp', behavior: this.upBehavior});
        this.keyService.setKey({id: 'down', behaviorId: 'moveDown', behavior: this.downBehavior});
        this.keyService.setKey({id: 'left', behaviorId: 'moveLeft', behavior: this.leftBehavior});
        this.keyService.setKey({id: 'right', behaviorId: 'moveRight', behavior: this.rightBehavior});
        this.keyService.setKey({id: 'next', behaviorId: 'next', behavior: this.nextBehavior});
        this.keyService.setKey({id: 'prev', behaviorId: 'prev', behavior: this.prevBehavior});
    }

    //  GETTERS

    getElem(id: string): ELEM | undefined {
        if (this.ElemMap.has(id))
            return this.ElemMap.get(id)!;
        return undefined;
    }

    //  SETTERS

    setElem(option: { id?: string, up?: string, upBehavior?: Behavior, down?: string, downBehavior?: Behavior, right?: string, rightBehavior?: Behavior, left?: string, leftBehavior?: Behavior, next?: string, nextBehavior?: Behavior, prev?: string, prevBehavior?: Behavior, reverse?: boolean }): void { 

        const { id = undefined, up = undefined, upBehavior = this.moveUp, down = undefined, downBehavior = this.moveDown, right = undefined, rightBehavior = this.moveRight, left = undefined, leftBehavior = this.moveLeft, next = undefined, nextBehavior = this.next, prev = undefined, prevBehavior = this.prev, reverse = false } = option;

        let newElem: ELEM;

        if (this.ElemMap.has(id!))
            newElem = this.ElemMap.get(id!)!;
        else {
            newElem = new ELEM(id!);
            this.ElemMap.set(id!, newElem);
        }
        
        newElem.upBehavior = option.upBehavior ? option.upBehavior : newElem.upBehavior || upBehavior;
        newElem.downBehavior = option.downBehavior ? option.downBehavior : newElem.downBehavior || downBehavior;
        newElem.rightBehavior = option.rightBehavior ? option.rightBehavior : newElem.rightBehavior || rightBehavior;
        newElem.leftBehavior = option.leftBehavior ? option.leftBehavior : newElem.leftBehavior || leftBehavior;
        newElem.nextBehavior = option.nextBehavior ? option.nextBehavior : newElem.nextBehavior || nextBehavior;
        newElem.prevBehavior = option.prevBehavior ? option.prevBehavior : newElem.prevBehavior || prevBehavior;
        
        this.head = this.head ? this.head : newElem;

        if (up && this.ElemMap.has(up))
            newElem.up = this.ElemMap.get(up)!;
        else if (up) {
            newElem.up = new ELEM(up);
            this.ElemMap.set(up, newElem.up);
        }
        if (up && reverse)
            this.ElemMap.get(up)!.down = newElem;
        
        if (down && this.ElemMap.has(down))
            newElem.down = this.ElemMap.get(down)!;
        else if (down) {
            newElem.down = new ELEM(down);
            this.ElemMap.set(down, newElem.down);
        }
        if (down && reverse)
            this.ElemMap.get(down)!.up = newElem;

        if (right && this.ElemMap.has(right))
            newElem.right = this.ElemMap.get(right)!;
        else if (right) {
            newElem.right = new ELEM(right);
            this.ElemMap.set(right, newElem.right);
        }
        if (right && reverse)
            this.ElemMap.get(right)!.left = newElem;

        if (left && this.ElemMap.has(left))
            newElem.left = this.ElemMap.get(left)!;
        else if (left) {
            newElem.left = new ELEM(left);
            this.ElemMap.set(left, newElem.left);
        }
        if (left && reverse)
            this.ElemMap.get(left)!.right = newElem;

        if (next && this.ElemMap.has(next))
            newElem.next = this.ElemMap.get(next)!;
        else if (next) {
            newElem.next = new ELEM(next);
            this.ElemMap.set(next, newElem.next);
        }
        if (next && reverse)
            this.ElemMap.get(next)!.prev = newElem;

        if (prev && this.ElemMap.has(prev))
            newElem.prev = this.ElemMap.get(prev)!;
        else if (prev) {
            newElem.prev = new ELEM(prev);
            this.ElemMap.set(prev, newElem.prev);
        }
        if (prev && reverse)
            this.ElemMap.get(prev)!.next = newElem;
    }

    setArrayElem( option: { array: Array<any>, id: string, route: string, before?: string, after?: string, prev?: string, nextBehavior?: Behavior }) {

        option.array.forEach((elem, index) => {
            this.setElem({
                id: option.id + index + option.route, 
                up : index == 0 ?
                    option.before != undefined ? option.before : option.id + index + option.route
                    :
                    option.id + (index - 1) + option.route,
                down: index == option.array.length - 1 ?
                    option.after != undefined ? option.after : option.id + index+ option.route
                     :
                    option.id + (index + 1) + option.route,
                prev: option.prev,
                nextBehavior: option.nextBehavior
            });
        });

        if (option.array.length != 0)
        {
            if (option.before)
                this.setElem({id: option.before, down: option.id + 0 + option.route});
            if (option.after)
                this.setElem({id: option.after, up: option.id + (option.array.length - 1) + option.route});
        }
    }
    
    //  METHODS

    upBehavior = () => { this.head?.upBehavior ? this.head.upBehavior() : null; }
    downBehavior = () => { this.head?.downBehavior ? this.head.downBehavior() : null; }
    leftBehavior = () => { this.head?.leftBehavior ? this.head.leftBehavior() : null; }
    rightBehavior = () => { this.head?.rightBehavior ? this.head.rightBehavior() : null; }
    nextBehavior = () => { this.head?.nextBehavior ? this.head.nextBehavior() : null; }
    prevBehavior = () => { this.head?.prevBehavior ? this.head.prevBehavior() : null; }

    moveUp = () => { this.head?.up ? this.head = this.head.up as ELEM : null; }
    moveDown = () => { this.head?.down ? this.head = this.head.down as ELEM : null; }
    moveLeft = () => { this.head?.left ? this.head = this.head.left as ELEM : null; }
    moveRight = () => { this.head?.right ? this.head = this.head.right as ELEM : null; }

    next = () => { this.navigateToElement(this.head?.next) }
    prev = () => { this.head?.route !== "/" ? this.navigateToElement(this.head?.prev) : null; }

    isSelected(id: string): boolean { return this.head?.route ? this.cutOnRoute(this.head?.route)[0] === id : false; }

    cutOnRoute(idAndRoute: string): [string, string] { return !idAndRoute ? ['', ''] : [idAndRoute.substring(0, idAndRoute.indexOf('/')), idAndRoute.substring(idAndRoute.indexOf('/'))]; }

    navigateToId(id: string) {

        if (!this.ElemMap.has(id))
            this.setElem({id: id});
        this.navigateToElement(this.ElemMap.get(id))
    }
    navigateToElement(element: ELEM | undefined) {

        if (this.head && element) {

            if (this.cutOnRoute(element.route)[1] != this.cutOnRoute(this.head.route)[1]) {

                this.pageChangeBehavior(element.route);
                this.router.navigate([this.cutOnRoute(element.route)[1]]);
            }
            this.head = element;
        }
    }

    setDefaultElem(id : string, route : string) { this.cutOnRoute(this.head?.route!)[1] !== route ? this.head = this.getElem(id + route) : null; }
    setPageChangeBehavior(behavior : (newRoute: string) => void) { this.pageChangeBehavior = behavior; }
    getPageChangeBehavior() { return this.pageChangeBehavior; }
}