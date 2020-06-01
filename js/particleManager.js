class ParticleManager {
    static particles = [];

    static add(particle) {
        ParticleManager.particles.push(particle);
    }

    static update(canvas, entities) {
        ParticleManager.particles = ParticleManager.particles
            .filter(particle => particle.destroyMe === false);
        ParticleManager.particles.forEach(particle => { particle.update(canvas, entities); });
    }

    static draw(context) {
        ParticleManager.particles.forEach(particle => { particle.draw(context); });
    }
}

export default ParticleManager;
