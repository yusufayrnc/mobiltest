import { Platform } from 'react-native';

let ArrowLeft: any;
let ArrowRight: any;
let Check: any;
let Image: any;
let ClipboardCheck: any;
let Clock3: any;
let Sparkles: any;
let LucideImage: any;
let Mail: any;
let UserRound: any;
let LockKeyhole: any;
let CheckCircle2: any;
let Eye: any;
let EyeOff: any;

if (Platform.OS === 'web') {
  const lucide = require('lucide-react');
  ArrowLeft = lucide.ArrowLeft;
  ArrowRight = lucide.ArrowRight;
  Check = lucide.Check;
  Image = lucide.Image;
  ClipboardCheck = lucide.ClipboardCheck;
  Clock3 = lucide.Clock3;
  Sparkles = lucide.Sparkles;
  LucideImage = lucide.Image;
  Mail = lucide.Mail;
  UserRound = lucide.UserRound;
  LockKeyhole = lucide.LockKeyhole;
  CheckCircle2 = lucide.CheckCircle2;
  Eye = lucide.Eye;
  EyeOff = lucide.EyeOff;
} else {
  const lucide = require('lucide-react-native');
  ArrowLeft = lucide.ArrowLeft;
  ArrowRight = lucide.ArrowRight;
  Check = lucide.Check;
  Image = lucide.Image;
  ClipboardCheck = lucide.ClipboardCheck;
  Clock3 = lucide.Clock3;
  Sparkles = lucide.Sparkles;
  LucideImage = lucide.Image;
  Mail = lucide.Mail;
  UserRound = lucide.UserRound;
  LockKeyhole = lucide.LockKeyhole;
  CheckCircle2 = lucide.CheckCircle2;
  Eye = lucide.Eye;
  EyeOff = lucide.EyeOff;
}

export { ArrowLeft, ArrowRight, Check, Image, ClipboardCheck, Clock3, Sparkles, LucideImage, Mail, UserRound, LockKeyhole, CheckCircle2, Eye, EyeOff };