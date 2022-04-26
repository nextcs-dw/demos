class Individual {

  final int CHROMOSOME_LENGTH = NUM_MOVES * 2;
  static final int MOVE_GENE_LENGTH = 5;
  static final float MAX_FORCE = 0.1;
  
  Rocket phenotype;
  Gene[] chromosome;
  float fitness;
  boolean hitObstacle;
  color c;

  Individual(boolean random) {

    chromosome = new Gene[CHROMOSOME_LENGTH];

    if (random) {
      for (int g=0; g<chromosome.length; g++) {
        chromosome[g] = new Gene(MOVE_GENE_LENGTH);
      }
      setPhenotype();
    }
  }//constructor

  void setPhenotype() {
    c = color(random(256), random(256), random(256));
    PVector angles[] = new PVector[CHROMOSOME_LENGTH/2];
    float mags[] = new float[CHROMOSOME_LENGTH/2];
    int valCount = 0;
    for (int g=0; g<CHROMOSOME_LENGTH; g+=2) {
      float theta = chromosome[g].value / pow(2, MOVE_GENE_LENGTH);
      theta = radians(360*theta);
      angles[valCount] = new PVector(cos(theta), sin(theta) );
      float mag = chromosome[g+1].value / pow(2, MOVE_GENE_LENGTH);
      mag *= MAX_FORCE;
      mags[valCount] = mag;
      valCount++;
    }
    phenotype = new Rocket(angles, mags, CHROMOSOME_LENGTH/2);
  }

  Individual mate(Individual partner) {
    Individual child = new Individual(false);
    Individual parents[] = {this, partner};
    int currentParent = int(random(2));
    int crossoverPoint = int(random(CHROMOSOME_LENGTH));
    for (int g=0; g < CHROMOSOME_LENGTH; g++) {
      if (g == crossoverPoint) {
        currentParent = (currentParent+1)%2;
      }
      child.chromosome[g] = new Gene(parents[currentParent].chromosome[g]);
    }
    child.setPhenotype();
    return child;
  }//mate

  void setFitness(Block goal) {
    float d = dist(phenotype.position.x, phenotype.position.y, goal.x, goal.y);
    //fitness = pow(1/d, 2);
    fitness = 10/(10+d);
    if ( hitObstacle ) {
      fitness*= 0.1;
    }
    //println(fitness);
  }//setFitness

  void mutate(float rate) {
    for (int g=0; g < CHROMOSOME_LENGTH; g++) {
      if (random(1) < rate) {
        chromosome[g].mutate();
        setPhenotype();
      }
    }
  }//mutate

  void run(boolean showFitness, Block obstacles[]) {
    hitObstacle = phenotype.run(obstacles);
    display(showFitness);
  }

  void display(boolean showFitness) {
    phenotype.display(c);
    if (showFitness) {

      //println(fitness);
      textSize(15);
      fill(0);
      textAlign(CENTER);
      text(fitness, phenotype.position.x, phenotype.position.y);
    }
  }//display()

  String toString() {
    String s = "[ ";
    for (int i=0; i<CHROMOSOME_LENGTH; i++) {
      s+= chromosome[i].value + " ";
    }
    return s + "]";
  }//toString()

}//Individual
