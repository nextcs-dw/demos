class Population {

  final static float DEFAULT_MUTATION_RATE = 0.05;

  Individual pop[];
  int numIndividuals;
  float totalFitness;
  float mutationRate;

  Population(int popSize) {
    numIndividuals = popSize;
    pop = new Individual[numIndividuals];
    mutationRate = DEFAULT_MUTATION_RATE;
  }//constructor

  void randomPop() {
    for (int p=0; p < numIndividuals; p++) {
      pop[p] = new Individual(true);
    }
  }//randomPop

  void run(boolean showFitness, Block obstacles[]) {
    for (int p=0; p < numIndividuals; p++) {
      pop[p].run(showFitness, obstacles);
    }
  }//

  void display(boolean showFitness) {
    for (int p=0; p < numIndividuals; p++) {
      pop[p].display(showFitness);
    }
  }//

  Individual get(int index) {
    return pop[index];
  }//get


  void setFitness(Block target) {
    totalFitness = 0;
    for (int p=0; p < numIndividuals; p++) {
      pop[p].setFitness(target);
      totalFitness+= pop[p].fitness;
    }
  }//setFitness

  Individual select() {
    float r = random(totalFitness);
    float fitnessCounter = 0;
    int p = -1;
    while (fitnessCounter < r) {
      p++;
      fitnessCounter+= pop[p].fitness;
    }
    return pop[p];
  }//select
  
  Individual tournamentSelect() {
    int p0 = int(random(numIndividuals));
    int p1 = int(random(numIndividuals));
    while (p1 == p0) {
      p1 = int(random(numIndividuals));
    }
    if (pop[p0].fitness > pop[p1].fitness) {
      return pop[p0];
    }
    else {
      return pop[p1];
    }
  }//tournamentSelect


  Population matingSeason(boolean keepBest) {
    Population nextGeneration = new Population( numIndividuals );
    int bestIndex = -1;
    if (keepBest) {
      bestIndex = getBestIndex();
    }
    for (int p=0; p < numIndividuals; p++) {
      if (keepBest && (p == bestIndex)) {
        pop[p].phenotype.reset();
        nextGeneration.pop[p] = pop[p];
      }
      else {
        Individual p0 = select();
        Individual p1 = select();
        Individual child = p0.mate(p1);
        child.mutate(mutationRate);
        nextGeneration.pop[p] = child;
      }
     //  //print(nextGeneration.pop[p]);
    }
    return nextGeneration;
  }//matingSeason

  int getBestIndex() {
    int best = 0;
    for (int p=1; p < numIndividuals; p++) {
      if (pop[p].fitness > pop[best].fitness) {
        best = p;
      }
    }
    return best;
  }//getBest

  float getBestFitness() {
    return pop[getBestIndex()].fitness;
  }//getBestFitness

  float getAvgFitness() {
    return totalFitness / numIndividuals;
  }
}//Population
