import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users/users.repository';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';

const mockMessagesRepository = () => ({
  getMessages: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValueOnce([
      {
        message: 'sample message 1',
        sender: { username: 'tester 1' },
        createdDate: new Date('2023-01-09T04:51:24.919Z'),
      },
      {
        message: 'sample message 2',
        sender: { username: 'tester 2' },
        createdDate: new Date('2023-01-08T05:22:20.919Z'),
      },
    ]),
  })),
});

const mockUsersRepository = () => ({
  findOneBy: jest.fn(),
});

const mockReceiver = 'receiver.example';

describe('MessagesService', () => {
  let messagesService: MessagesService;
  let messagesRepository: jest.Mocked<MessagesRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: MessagesRepository, useFactory: mockMessagesRepository },
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();

    messagesService = module.get(MessagesService);
    messagesRepository = module.get(MessagesRepository);
    usersRepository = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(messagesService).toBeDefined();
  });

  describe('getMessages', () => {
    it('Calls MessagesRepository for messages and return the result', async () => {
      usersRepository.findOneBy.mockResolvedValue({
        id: '123',
        username: 'username',
        password: 'password',
      });

      const result = await messagesService.getMessages(mockReceiver);
      const expectedResult = {
        messages: [
          {
            message: 'sample message 1',
            sender: 'tester 1',
            date: '2023-01-09T04:51:24.919Z',
          },
          {
            message: 'sample message 2',
            sender: 'tester 2',
            date: '2023-01-08T05:22:20.919Z',
          },
        ],
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
