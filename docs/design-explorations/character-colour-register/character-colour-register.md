# Character Colour Register (Educational Font Selection)

## Purpose
This document defines the colour palette for character representation across the Old MacDonald Had a School platform. The selection emphasizes educational appropriateness and accessibility while maintaining brand consistency.

## Core Characters & Educational Themes

### Early Years Characters (Ages 2-5)

#### Miss Puddles 🌊
- **Colour**: #e8a227 (mustard/gold) - Warm, inviting
- **Personality**: Gentle, nurturing, curious
- **Educational Focus**: foundational skills, emotional awareness
- **Visual Treatment**: Soft shadows, rounded corners

#### Miss Maisy 🌿
- **Colour**: #55705a (sage green) - Calm, balanced
- **Personality**: Creative, artistic, supportive
- **Educational Focus**: exploration, self-expression
- **Visual Treatment**: subtle gradients, natural textures

#### Mr Rusty 🔧
- **Colour**: #2c6c9b (ocean blue) - Clear, confident
- **Personality**: problem-solver, logical, patient
- **Educational Focus**: critical thinking, science exploration
- **Visual Treatment**: angular elements, depth layers

#### Miss Hayley 🌺
- **Colour**: #c9527a (rose) - warm, energetic
- **Personality**: enthusiastic, social, caring
- **Educational Focus**: literacy, communication
- **Visual Treatment**: vibrant accents, movement elements

#### Mr Maisy ❤️
- **Colour**: #b5272c (deep red) - strong, determined
- **Personality**: resilient, focused, achievement-oriented
- **Educational Focus**: numeracy, structured learning
- **Visual Treatment**: bold outlines, emphasis highlights

### Elementary Characters (Ages 6-8)

#### Mr Sam 💙
- **Colour**: #1f6b6b (deep teal) - thoughtful, steady
- **Personality**: analytical, methodical, precise
- **Educational Focus**: complex problem-solving, spatial reasoning
- **Visual Treatment**: geometric patterns, symmetry

#### Miss Puddles Extension
- **Additional Character**: Differentiated learning needs
- **Colour**: Softened version of core palette
- **Educational Focus**: inclusive education, accommodations

## Student Characters (Learning Support)

### Primary Student Representation

#### Whiskers 🐱
- **Colour**: #7b4fa8 (purple) - imaginative, creative
- **Personality**: curious, exploratory, inventive
- **Educational Focus**: innovation, creative thinking
- **Visual Treatment**: flowing lines, organic shapes

#### Hopper 🐰
- **Colour**: #d9713c (warm orange) - energetic, dynamic
- **Personality**: enthusiastic, active, collaborative
- **Educational Focus**: physical development, teamwork
- **Visual Treatment**: vibrant movement, kinetic elements

#### Scout 🦁
- **Colour**: #4a7a3a (forest green) - grounded, stable
- **Personality**: brave, reliable, dependable
- **Educational Focus**: leadership, responsibility
- 
#### Penny 🎯
- **Colour**: #c9962e (golden) - precise, analytical
- **Personality**: thoughtful, careful, organized
- **Educational Focus**: attention to detail, accuracy
- **Visual Treatment**: structured layouts, clear hierarchies

### Inclusive Representation

#### Maisy 🎯
- **Colour**: #1f4e5f (deep blue-green) - calm, thoughtful
- **Personality**: reflective, meditative, balanced
- **Educational Focus**: mindfulness, self-regulation
- **Visual Treatment**: subtle, understated presence

#### Puddles 🐠
- **Colour**: #4fa0c9 (soft blue) - gentle, nurturing
- **Personality**: empathetic, supportive, compassionate
- **Educational Focus**: social-emotional learning
- **Visual Treatment**: soft edges, gentle transitions

#### Sam 🐋
- **Colour**: #7a9a3d (olive) - versatile, adaptable
- **Personality**: flexible, resourceful, adaptable
- **Educational Focus**: versatility, multiple strategies
- **Visual Treatment**: modular, reconfigurable elements

#### Rusty 🪵
- **Colour**: #8b5030 (earthy brown) - authentic, real
- **Personality**: grounded, practical, reliable
- **Educational Focus**: experiential learning
- **Visual Treatment**: natural textures, organic materials

## Colour Implementation Guidelines

### Accessibility Standards

#### Contrast Ratios
- **Minimum**: 4.5:1 for normal text
- **Large Text**: 3:1 for headings and emphasis
- **Focus Indicators**: High contrast for keyboard navigation

#### Colour Blindness Considerations
- Avoid red/green differentiation
- Use patterns and labels in addition to colour
- Ensure text remains distinguishable when colour is removed

#### Educational Psychology

#### Positive Associations
- **Gold/Yellow**: Attention, warmth, optimism
- **Blue**: Calm, focus, trust
- **Green**: Growth, harmony, balance
- **Purple**: Creativity, imagination, wisdom
- **Red**: Energy, strength, courage

### Usage Rules

#### Hierarchy
1. **Primary Actions**: Use main brand colours
2. **Secondary Actions**: Use complementary colours
3. **Information**: Use muted/secondary colours
4. **Alerts/Warnings**: Use high-contrast colours

#### Context
- **Daycare Content**: Softer, gentler colours
- **Elementary Content**: More distinct, engaging colours
- **Learning Support**: Calmer, less stimulating colours

### Technical Implementation

#### CSS Custom Properties
```css
:root {
  /* Core character colours */
  --cast-miss-puddles-color: #e8a227;
  --cast-miss-puddles-foreground: #1e2a38;
  
  --cast-miss-maisy-color: #55705a;
  --cast-miss-maisy-foreground: #fefce8;
  
  /* Student representation */
  --cast-whiskers-color: #7b4fa8;
  --cast-whiskers-foreground: #fefce8;
  
  /* Grade-specific tokens */
  --grade-daycare-color: #e8a227;
  --grade-pre-school-color: #55705a;
  --grade-kindergarten-color: #2c6c9b;
  --grade-one-color: #c9527a;
  --grade-two-color: #b5272c;
}
```

#### Component Integration
```tsx
// Usage in badge components
<span 
  className="badge" 
  style={{ 
    backgroundColor: 'var(--cast-miss-puddles-color)',
    color: 'var(--cast-miss-puddles-foreground)'
  }}
>
  Miss Puddles
</span>
```

### Maintenance

#### Version Control
- Colour hex codes should be defined in one location only
- Use CSS custom properties for consistency
- Document any colour changes with reasoning

#### Review Process
- Quarterly accessibility review
- Annual colour palette refresh
- Feedback integration from educators and students

## References

1. **Educational Psychology Research**: Colour impact on learning and attention
2. **Universal Design for Learning**: Multiple means of representation
3. **Accessibility Standards**: WCAG 2.1 Level AA compliance
4. **Child Development**: Age-appropriate colour associations

---

*This document is a living document and will be updated as educational research and accessibility standards evolve.*