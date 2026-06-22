import pygame
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GLU import *
import math
import asyncio
import platform
import random

# Pygame and OpenGL initialization
pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT), DOUBLEBUF | OPENGL)
pygame.display.set_caption("3D Solar System Rocket Game")
gluPerspective(45, WIDTH / HEIGHT, 0.1, 100.0)
glTranslatef(0.0, 0.0, -10.0)
clock = pygame.time.Clock()
font = pygame.font.SysFont("arial", 20)

# Orbital parameters
AU = 149.6e9
MERCURY_RADIUS = 0.39 * AU
VENUS_RADIUS = 0.72 * AU
EARTH_RADIUS = 1.0 * AU
MARS_RADIUS = 1.524 * AU
JUPITER_RADIUS = 5.2 * AU
MERCURY_PERIOD = 88.0 * 24 * 3600
VENUS_PERIOD = 225.0 * 24 * 3600
EARTH_PERIOD = 365.25 * 24 * 3600
MARS_PERIOD = 687.0 * 24 * 3600
JUPITER_PERIOD = 11.86 * 365.25 * 24 * 3600
G = 6.67430e-11
M_SUN = 1.989e30
MARS_INCLINATION = math.radians(1.85)
MERCURY_INCLINATION = math.radians(7.0)
VENUS_INCLINATION = math.radians(3.39)
JUPITER_INCLINATION = math.radians(1.31)

# Hohmann transfer orbit
a_transfer = (EARTH_RADIUS + MARS_RADIUS) / 2
T_transfer = 2 * math.pi * math.sqrt(a_transfer**3 / (G * M_SUN))
mars_initial_angle = math.radians(45)

# Asteroid belt
NUM_ASTEROIDS = 200
asteroids = [(random.uniform(2.0 * AU, 3.2 * AU), random.uniform(0, 2 * math.pi), random.uniform(-0.1, 0.1)) for _ in range(NUM_ASTEROIDS)]

# Resource pods
NUM_PODS = 10
pods = []
particles = []

# Simulation parameters
SCALE = 0.5 / AU
TIME_STEP = 3600 * 24
t = 0
spacecraft_launched = False
spacecraft_t = 0
running = True
FPS = 1200

# Game parameters
fuel = 100.0
health = 100.0
score = 0
level = 1
game_state = "playing"
rocket_velocity = [0, 0, 0]
rocket_position = [0, 0, 0]
show_popup = False
venus_slingshot_achieved = False

# Camera control
camera_angle_x = 0
camera_angle_y = 0
camera_distance = 10.0
mouse_down = False
last_mouse_pos = (0, 0)

# Stars and galaxies
NUM_STARS = 1000
stars = []
NUM_GALAXIES = 3
galaxies = []

# Educational pop-ups
popups = {
    1: "Hohmann Transfer: A fuel-efficient elliptical orbit to travel between planets, minimizing delta-V.",
    2: "Gravitational Slingshot: Use a planet’s gravity to gain speed, like passing near Venus to reach Mars faster.",
    3: "Delta-V: The change in velocity needed for maneuvers, critical for precise landings on Mars."
}

def setup():
    global t, spacecraft_launched, spacecraft_t, fuel, health, score, level, game_state, rocket_position, rocket_velocity
    global pods, particles, venus_slingshot_achieved, asteroids
    t = 0
    spacecraft_launched = False
    spacecraft_t = 0
    fuel = 100.0
    health = 100.0
    score = score if game_state == "mission_complete" else 0
    level = 1 if game_state != "mission_complete" else level
    game_state = "playing"
    rocket_position = list(get_planet_position(EARTH_RADIUS, EARTH_PERIOD, t))
    rocket_velocity = [0, 0, 0]
    venus_slingshot_achieved = False
    asteroids = [(random.uniform(2.0 * AU, 3.2 * AU), random.uniform(0, 2 * math.pi), random.uniform(-0.1, 0.1)) for _ in range(NUM_ASTEROIDS * (1 + level // 2))]
    glEnable(GL_DEPTH_TEST)
    glEnable(GL_BLEND)
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
    glClearColor(0, 0, 0, 1)

    # Generate stars
    global stars, galaxies
    stars = []
    for _ in range(NUM_STARS):
        theta = random.uniform(0, 2 * math.pi)
        phi = random.uniform(-math.pi / 2, math.pi / 2)
        r = random.uniform(20.0, 50.0)
        x = r * math.cos(phi) * math.cos(theta)
        y = r * math.cos(phi) * math.sin(theta)
        z = r * math.sin(phi)
        brightness = random.uniform(0.5, 1.0)
        stars.append((x, y, z, brightness))

    # Generate galaxies
    galaxies = []
    for _ in range(NUM_GALAXIES):
        x = random.uniform(-40, 40)
        y = random.uniform(-40, 40)
        z = random.uniform(-40, 40)
        size = random.uniform(5, 10)
        angle_x = random.uniform(0, math.pi)
        angle_y = random.uniform(0, math.pi)
        galaxies.append((x, y, z, size, angle_x, angle_y))

    # Generate pods
    pods.clear()
    for _ in range(NUM_PODS):
        r = random.uniform(EARTH_RADIUS, MARS_RADIUS)
        theta = random.uniform(0, 2 * math.pi)
        z = random.uniform(-0.1 * AU, 0.1 * AU)
        pods.append((r, theta, z))

def draw_sphere(x, y, z, radius, color, slices=16, stacks=16, texture_func=None):
    glPushMatrix()
    glTranslatef(x, y, z)
    quad = gluNewQuadric()
    if texture_func:
        glBegin(GL_QUADS)
        for i in range(slices):
            for j in range(stacks):
                theta1 = i * 2 * math.pi / slices
                theta2 = (i + 1) * 2 * math.pi / slices
                phi1 = j * math.pi / stacks - math.pi / 2
                phi2 = (j + 1) * math.pi / stacks - math.pi / 2
                color = texture_func(theta1, phi1)
                glColor3fv(color)
                for theta, phi in [(theta1, phi1), (theta2, phi1), (theta2, phi2), (theta1, phi2)]:
                    x = radius * math.cos(phi) * math.cos(theta)
                    y = radius * math.cos(phi) * math.sin(theta)
                    z = radius * math.sin(phi)
                    glVertex3f(x, y, z)
        glEnd()
    else:
        glColor3fv(color)
        gluSphere(quad, radius, slices, stacks)
    gluDeleteQuadric(quad)
    glPopMatrix()

def mercury_texture(theta, phi):
    return (0.7, 0.7, 0.7)

def venus_texture(theta, phi):
    return (1.0, 0.9, 0.5)

def earth_texture(theta, phi):
    return (0.0, 0.0, 1.0) if phi > 0 else (0.0, 0.8, 0.0)

def mars_texture(theta, phi):
    return (0.8, 0.4, 0.2)

def jupiter_texture(theta, phi):
    bands = math.sin(10 * phi)
    return (0.9, 0.6, 0.4) if bands > 0 else (0.8, 0.5, 0.3)

def draw_rocket(x, y, z, scale=0.02):
    glPushMatrix()
    glTranslatef(x, y, z)
    glColor3fv((0.8, 0.8, 0.8))
    quad = gluNewQuadric()
    glPushMatrix()
    glRotatef(-90, 1, 0, 0)
    gluCylinder(quad, scale, scale, scale * 3, 12, 1)
    glPopMatrix()
    glPushMatrix()
    glTranslatef(0, 0, scale * 3)
    glRotatef(-90, 1, 0, 0)
    gluCylinder(quad, scale, 0, scale * 1.5, 12, 1)
    glPopMatrix()
    gluDeleteQuadric(quad)
    glPopMatrix()

def draw_orbit(radius, inclination, segments=100, color=(1, 1, 1)):
    glBegin(GL_LINE_LOOP)
    glColor3fv(color)
    for i in range(segments):
        theta = 2 * math.pi * i / segments
        x = radius * math.cos(theta)
        y = radius * math.sin(theta) * math.cos(inclination)
        z = radius * math.sin(theta) * math.sin(inclination)
        glVertex3f(x, y, z)
    glEnd()

def draw_trajectory():
    glBegin(GL_LINE_STRIP)
    glColor3fv((1, 1, 0))
    segments = 100
    for i in range(segments + 1):
        t = i * T_transfer / segments
        angle = 2 * math.pi * t / T_transfer
        r = a_transfer * (1 - 0.5**2) / (1 + 0.5 * math.cos(angle))
        x = r * math.cos(angle)
        y = r * math.sin(angle) * math.cos(MARS_INCLINATION / 2)
        z = r * math.sin(angle) * math.sin(MARS_INCLINATION / 2)
        glVertex3f(x * SCALE, y * SCALE, z * SCALE)
    glEnd()

def draw_stars():
    glPointSize(2)
    glBegin(GL_POINTS)
    for x, y, z, brightness in stars:
        glColor4f(1, 1, 1, brightness)
        glVertex3f(x, y, z)
    glEnd()

def draw_galaxies():
    segments = 100
    for x, y, z, size, angle_x, angle_y in galaxies:
        glPushMatrix()
        glTranslatef(x, y, z)
        glRotatef(math.degrees(angle_x), 1, 0, 0)
        glRotatef(math.degrees(angle_y), 0, 1, 0)
        glBegin(GL_LINE_LOOP)
        glColor4f(1, 1, 1, 0.3)
        for i in range(segments):
            theta = 2 * math.pi * i / segments
            r = size * (1 + 0.2 * math.sin(4 * theta))
            gx = r * math.cos(theta)
            gy = r * math.sin(theta)
            glVertex3f(gx, gy, 0)
        glEnd()
        glPopMatrix()

def draw_asteroids():
    glPointSize(1)
    glBegin(GL_POINTS)
    glColor3fv((0.5, 0.5, 0.5))
    for radius, theta, z_offset in asteroids:
        x = radius * math.cos(theta)
        y = radius * math.sin(theta)
        z = z_offset
        glVertex3f(x * SCALE, y * SCALE, z * SCALE)
    glEnd()

def draw_pods():
    glPointSize(3)
    glBegin(GL_POINTS)
    glColor3fv((0, 1, 0))
    for r, theta, z in pods:
        x = r * math.cos(theta)
        y = r * math.sin(theta)
        glVertex3f(x * SCALE, y * SCALE, z * SCALE)
    glEnd()

def draw_particles():
    glPointSize(2)
    glBegin(GL_POINTS)
    for x, y, z, alpha, _ in particles:
        glColor4f(1, 1, 1, alpha)
        glVertex3f(x * SCALE, y * SCALE, z * SCALE)
    glEnd()

def get_planet_position(radius, period, t, inclination=0, initial_angle=0):
    angular_velocity = 2 * math.pi / period
    angle = angular_velocity * t + initial_angle
    x = radius * math.cos(angle)
    y = radius * math.sin(angle) * math.cos(inclination)
    z = radius * math.sin(angle) * math.sin(inclination)
    return x, y, z

def get_spacecraft_position(t):
    if not spacecraft_launched:
        return get_planet_position(EARTH_RADIUS, EARTH_PERIOD, t)
    mu = G * M_SUN
    angle = 2 * math.pi * t / T_transfer
    r = a_transfer * (1 - 0.5**2) / (1 + 0.5 * math.cos(angle))
    x = r * math.cos(angle)
    y = r * math.sin(angle) * math.cos(MARS_INCLINATION / 2)
    z = r * math.sin(angle) * math.sin(MARS_INCLINATION / 2)
    return x, y, z

def check_collisions():
    global health, score, pods, particles
    sc_x, sc_y, sc_z = rocket_position
    # Asteroid collisions
    for radius, theta, z_offset in asteroids:
        ax = radius * math.cos(theta)
        ay = radius * math.sin(theta)
        az = z_offset
        distance = math.sqrt((sc_x - ax)**2 + (sc_y - ay)**2 + (sc_z - az)**2)
        if distance < 0.05 * AU:
            health -= 10
            if health <= 0:
                return False
    # Pod collection
    new_pods = []
    for r, theta, z in pods:
        px = r * math.cos(theta)
        py = r * math.sin(theta)
        distance = math.sqrt((sc_x - px)**2 + (sc_y - py)**2 + (sc_z - z)**2)
        if distance < 0.05 * AU:
            score += 100
            if random.random() < 0.5:
                health = min(100, health + 20)
            else:
                fuel = min(100, fuel + 20)
            # Add particles
            for _ in range(20):
                vx = random.uniform(-1e6, 1e6)
                vy = random.uniform(-1e6, 1e6)
                vz = random.uniform(-1e6, 1e6)
                particles.append([px, py, z, 1.0, [vx, vy, vz]])
        else:
            new_pods.append((r, theta, z))
    pods = new_pods
    return True

def update_particles():
    new_particles = []
    for p in particles:
        x, y, z, alpha, vel = p
        x += vel[0] * TIME_STEP
        y += vel[1] * TIME_STEP
        z += vel[2] * TIME_STEP
        alpha -= TIME_STEP / (3600 * 24)
        if alpha > 0:
            new_particles.append([x, y, z, alpha, vel])
    return new_particles

def draw_ui():
    glMatrixMode(GL_PROJECTION)
    glPushMatrix()
    glLoadIdentity()
    glOrtho(0, WIDTH, HEIGHT, 0, -1, 1)
    glMatrixMode(GL_MODELVIEW)
    glPushMatrix()
    glLoadIdentity()

    # Render UI text
    objective = {
        1: "Reach Mars, avoid asteroids!",
        2: "Slingshot around Venus, then reach Mars!",
        3: "Land precisely on Mars with minimal fuel!"
    }.get(level, "Reach Mars!")
    texts = [
        (font.render(f"Level: {level}", True, (255, 255, 255)), 10, 10),
        (font.render(f"Objective: {objective}", True, (255, 255, 255)), 10, 40),
        (font.render(f"Fuel: {fuel:.1f}%", True, (255, 255, 255)), 10, 70),
        (font.render(f"Health: {health:.1f}%", True, (255, 255, 255)), 10, 100),
        (font.render(f"Score: {score}", True, (255, 255, 255)), 10, 130)
    ]
    if game_state in ["game_over", "mission_complete"]:
        status = "Game Over!" if game_state == "game_over" else "Mission Complete!"
        texts.append((font.render(status, True, (255, 255, 255)), WIDTH // 2 - 50, HEIGHT // 2 - 60))
        texts.append((font.render("Restart [Click]", True, (255, 255, 255)), WIDTH // 2 - 50, HEIGHT // 2))
        texts.append((font.render("Quit [Click]", True, (255, 255, 255)), WIDTH // 2 - 50, HEIGHT // 2 + 30))
    if show_popup:
        popup_text = font.render(popups.get(level, ""), True, (255, 255, 255))
        texts.append((popup_text, WIDTH // 2 - 100, HEIGHT // 2 - 100))

    # Convert to OpenGL texture
    def text_to_texture(text_surface):
        data = pygame.image.tostring(text_surface, "RGBA", True)
        width, height = text_surface.get_size()
        texture_id = glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D, texture_id)
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, data)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)
        return texture_id, width, height

    glEnable(GL_TEXTURE_2D)
    glEnable(GL_BLEND)
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
    if show_popup:
        glBegin(GL_QUADS)
        glColor4f(0, 0, 0, 0.5)
        glVertex2f(WIDTH // 2 - 150, HEIGHT // 2 - 120)
        glVertex2f(WIDTH // 2 + 150, HEIGHT // 2 - 120)
        glVertex2f(WIDTH // 2 + 150, HEIGHT // 2 - 80)
        glVertex2f(WIDTH // 2 - 150, HEIGHT // 2 - 80)
        glEnd()

    for text_surface, x, y in texts:
        texture_id, w, h = text_to_texture(text_surface)
        glBindTexture(GL_TEXTURE_2D, texture_id)
        glBegin(GL_QUADS)
        glTexCoord2f(0, 0); glVertex2f(x, y)
        glTexCoord2f(1, 0); glVertex2f(x + w, y)
        glTexCoord2f(1, 1); glVertex2f(x + w, y + h)
        glTexCoord2f(0, 1); glVertex2f(x, y + h)
        glEnd()
        glDeleteTextures(1, [texture_id])

    glDisable(GL_TEXTURE_2D)
    glMatrixMode(GL_PROJECTION)
    glPopMatrix()
    glMatrixMode(GL_MODELVIEW)
    glPopMatrix()

async def update_loop():
    global t, spacecraft_launched, spacecraft_t, running, fuel, health, score, level, game_state
    global camera_angle_x, camera_angle_y, camera_distance, mouse_down, last_mouse_pos
    global rocket_position, rocket_velocity, show_popup, venus_slingshot_achieved, particles

    if game_state == "playing":
        # Handle input
        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP] and fuel > 0:
            rocket_velocity[1] += 1e6 * TIME_STEP / (3600 * 24)
            fuel -= 0.1
        if keys[pygame.K_DOWN] and fuel > 0:
            rocket_velocity[1] -= 1e6 * TIME_STEP / (3600 * 24)
            fuel -= 0.1
        if keys[pygame.K_LEFT] and fuel > 0:
            rocket_velocity[0] -= 1e6 * TIME_STEP / (3600 * 24)
            fuel -= 0.1
        if keys[pygame.K_RIGHT] and fuel > 0:
            rocket_velocity[0] += 1e6 * TIME_STEP / (3600 * 24)
            fuel -= 0.1

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and not spacecraft_launched:
                    spacecraft_launched = True
                    # Get current angle of Earth
                    theta = (2 * math.pi * t / EARTH_PERIOD)
                    v_hohmann = math.sqrt(G * M_SUN * (2/EARTH_RADIUS - 1/a_transfer))
                    # Set rocket position to Earth's current position
                    rocket_position[0], rocket_position[1], rocket_position[2] = get_planet_position(EARTH_RADIUS, EARTH_PERIOD, t)
                    # Set velocity tangential to Earth's orbit
                    rocket_velocity[0] = -v_hohmann * math.sin(theta)
                    rocket_velocity[1] =  v_hohmann * math.cos(theta)
                    rocket_velocity[2] = 0
                if event.key == pygame.K_t:
                    show_popup = not show_popup
            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:
                    mouse_down = True
                    last_mouse_pos = event.pos
                elif event.button == 4:
                    camera_distance = max(2.0, camera_distance - 0.5)
                elif event.button == 5:
                    camera_distance = min(20.0, camera_distance + 0.5)
            if event.type == pygame.MOUSEBUTTONUP and event.button == 1:
                mouse_down = False
            if event.type == pygame.MOUSEMOTION and mouse_down:
                dx, dy = event.pos[0] - last_mouse_pos[0], event.pos[1] - last_mouse_pos[1]
                camera_angle_x += dx * 0.5
                camera_angle_y = min(max(camera_angle_y + dy * 0.5, -90), 90)
                last_mouse_pos = event.pos

        # Update rocket position
        if spacecraft_launched:
            for i in range(3):
                rocket_position[i] += rocket_velocity[i] * TIME_STEP
            spacecraft_t += TIME_STEP

        # Update particles
        particles = update_particles()

        # Check mission status
        mars_x, mars_y, mars_z = get_planet_position(MARS_RADIUS, MARS_PERIOD, t, MARS_INCLINATION, mars_initial_angle)
        distance_to_mars = math.sqrt(sum((rocket_position[i] - [mars_x, mars_y, mars_z][i])**2 for i in range(3)))
        if level == 2:
            venus_x, venus_y, venus_z = get_planet_position(VENUS_RADIUS, VENUS_PERIOD, t, VENUS_INCLINATION)
            distance_to_venus = math.sqrt(sum((rocket_position[i] - [venus_x, venus_y, venus_z][i])**2 for i in range(3)))
            if distance_to_venus < 0.05 * AU and not venus_slingshot_achieved:
                venus_slingshot_achieved = True
                rocket_velocity[0] *= 1.5
                rocket_velocity[1] *= 1.5
                rocket_velocity[2] *= 1.5
                score += 500
        mars_distance_threshold = 0.05 * AU if level < 3 else 0.02 * AU
        if distance_to_mars < mars_distance_threshold and spacecraft_launched and (level != 2 or venus_slingshot_achieved):
            game_state = "mission_complete"
            score += int(1000 * fuel + 1000 * health)
            level += 1
            if level > 3:
                level = 1
            setup()

        # Check collisions and fuel
        if not check_collisions() or fuel <= 0:
            game_state = "game_over"

    else:  # Game over or mission complete
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                x, y = event.pos
                if WIDTH // 2 - 50 <= x <= WIDTH // 2 + 50:
                    if HEIGHT // 2 <= y <= HEIGHT // 2 + 20:
                        setup()  # Restart
                    elif HEIGHT // 2 + 30 <= y <= HEIGHT // 2 + 50:
                        running = False  # Quit

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glLoadIdentity()
    gluPerspective(45, WIDTH / HEIGHT, 0.1, 100.0)
    glTranslatef(0, 0, -camera_distance)
    glRotatef(camera_angle_y, 1, 0, 0)
    glRotatef(camera_angle_x, 0, 1, 0)

    # Draw scene
    draw_stars()
    draw_galaxies()
    draw_orbit(MERCURY_RADIUS * SCALE, MERCURY_INCLINATION)
    draw_orbit(VENUS_RADIUS * SCALE, VENUS_INCLINATION)
    draw_orbit(EARTH_RADIUS * SCALE, 0)
    draw_orbit(MARS_RADIUS * SCALE, MARS_INCLINATION)
    draw_orbit(JUPITER_RADIUS * SCALE, JUPITER_INCLINATION)
    draw_trajectory()
    mercury_x, mercury_y, mercury_z = get_planet_position(MERCURY_RADIUS, MERCURY_PERIOD, t)
    draw_sphere(mercury_x * SCALE, mercury_y * SCALE, mercury_z * SCALE, 0.02, (0.7, 0.7, 0.7), texture_func=mercury_texture)
    venus_x, venus_y, venus_z = get_planet_position(VENUS_RADIUS, VENUS_PERIOD, t, VENUS_INCLINATION)
    draw_sphere(venus_x * SCALE, venus_y * SCALE, venus_z * SCALE, 0.04, (1.0, 0.9, 0.5), texture_func=venus_texture)
    earth_x, earth_y, earth_z = get_planet_position(EARTH_RADIUS, EARTH_PERIOD, t)
    draw_sphere(earth_x * SCALE, earth_y * SCALE, earth_z * SCALE, 0.05, (0.0, 0.0, 1.0), texture_func=earth_texture)
    mars_x, mars_y, mars_z = get_planet_position(MARS_RADIUS, MARS_PERIOD, t, MARS_INCLINATION, mars_initial_angle)
    draw_sphere(mars_x * SCALE, mars_y * SCALE, mars_z * SCALE, 0.04, (0.8, 0.4, 0.2), texture_func=mars_texture)
    jupiter_x, jupiter_y, jupiter_z = get_planet_position(JUPITER_RADIUS, JUPITER_PERIOD, t, JUPITER_INCLINATION)
    draw_sphere(jupiter_x * SCALE, jupiter_y * SCALE, jupiter_z * SCALE, 0.1, (0.9, 0.6, 0.4), texture_func=jupiter_texture)
    draw_sphere(0, 0, 0, 0.15, (1, 1, 0))
    draw_asteroids()
    draw_pods()
    draw_particles()
    draw_rocket(rocket_position[0] * SCALE, rocket_position[1] * SCALE, rocket_position[2] * SCALE)

    # Draw UI
    draw_ui()

    # Update time
    if game_state == "playing":
        t += TIME_STEP

    pygame.display.flip()

async def main():
    setup()
    while running:
        await update_loop()
        await asyncio.sleep(1.0 / FPS)

if platform.system() == "Emscripten":
    asyncio.ensure_future(main())
else:
    if __name__ == "__main__":
        asyncio.run(main())