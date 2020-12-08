import Matter, {
  Body,
  Engine,
  Render,
  Composites,
  Composite,
  Common,
  MouseConstraint,
  Mouse,
  World,
  Bodies,
  Events,
  Bounds,
} from "./matter";
import { TItem, TPlayer } from "./types";

// create engine
const engine = Engine.create(),
  world = engine.world;
let render: any;
world.gravity.y = 0;

Events.on(engine, "collisionStart", function (event: any) {
  var pairs = event.pairs;
  pairs[0].bodyA.owner.collides(pairs[0].bodyB.owner);
  pairs[0].bodyB.owner.collides(pairs[0].bodyA.owner);
});
Events.on(engine, "collisionEnd", function (event: any) {
  var pairs = event.pairs;
  pairs[0].bodyA.owner.collideEnd && pairs[0].bodyA.owner.collideEnd(pairs[0].bodyB.owner);
  pairs[0].bodyB.owner.collideEnd && pairs[0].bodyB.owner.collideEnd(pairs[0].bodyA.owner);
});

class Physics {
  totalBodies() {
    console.log("Total Bodies:", Composite.allBodies(world).length);
  }
  rect({ x, y, w, h, angle, type, img, canvasLayer }: any, bodyType: any, options: any) {
    if (type !== "bullet") {
      x += w / 2;
      y += h / 2;
    }

    const body = Bodies.rectangle(
      x,
      y,
      w,
      h,
      Object.assign(
        {
          isStatic: bodyType !== "dynamic",
          density: 100,
          render: {
            fillStyle: "transparent",
            sprite: {
              texture: !canvasLayer && img && `client/assets/images/${img}.png`,
            },
          },
          frictionAir: type !== "bullet" && 0.07,
        },
        options,
      ),
    );

    // if (this.type !== "bullet") {
    //   Body.setMass(body, 10000);
    //   Body.setDensity(body, 1000);
    // }
    body.owner = arguments[0];
    if (angle) Body.setAngle(body, angle);
    World.add(world, body);

    return { Body, body };
  }
  destroy() {
    world.hasDestroyed = true;
  }

  destroyItem(item: TItem) {
    Matter.Composite.remove(world, item.body);
  }
}
export const physics = new Physics();
export const BODY = Body;

class MatterMain {
  renderWorld(game: any, canvas: any) {
    render = Render.create({
      element: document.getElementById("container"),
      canvas,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        showCollisions: true,
        background: "transparent",
        hasBounds: true,
      },
    });
    Render.run(render);
  }

  loop(player: TPlayer) {
    if (render) {
      Bounds.shift(render.bounds, {
        x: player.body.position.x - window.innerWidth / 2,
        y: player.body.position.y - window.innerHeight / 2,
      });
    }
    if (world.hasDestroyed) {
      Composite.allBodies(world).forEach((body: any) => {
        if (body.destroyed) Matter.Composite.remove(world, body);
      });
      world.hasDestroyed = false;
    }
    Engine.update(engine, 1000 / 60);
  }
}

export const mainPhysics = new MatterMain();
